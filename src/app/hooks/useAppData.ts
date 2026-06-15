import { useState, useEffect, useMemo } from 'react';
import { uraianAnggaran, UraianAnggaran, Kegiatan, Bagian } from '../lib/data';

// Key for local storage
const STORAGE_KEY = 'master_uraian_anggaran';

// Default metadata for activities tracking that are added via Agenda & Kegiatan
// Because UraianAnggaran only stores budget and names, we will store the additional "Kegiatan" metadata
// (dates, PJ, steps, etc) in another key.
const KEGIATAN_META_KEY = 'kegiatan_metadata_v3';

export interface KegiatanMeta {
  id: string; // references uraianAnggaran kode
  penanggungJawab: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  deskripsi: string;
  steps: { id: string; nama: string; selesai: boolean }[];
  isApproved?: boolean;
  sumberDana?: string;
  anggaranDiminta?: number;
  createdByRole?: 'superadmin' | 'admin'; // who created this task
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
}

export interface AppUser {
  id: string;
  nama: string;
  email: string;
  password?: string;
  role: 'superadmin' | 'admin';
  bidangKode: string; // 'ALL' or '1', '2', etc.
  status: 'Aktif' | 'Nonaktif';
  lastLogin: string;
}

export function useAppData() {
  const [appUsers, setAppUsers] = useState<AppUser[]>([]);
  const [allDataUraian, setAllDataUraian] = useState<UraianAnggaran[]>([]);
  const [kegiatanMeta, setKegiatanMeta] = useState<KegiatanMeta[]>([]);
  const [allActivityLogs, setAllActivityLogs] = useState<ActivityLog[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize from LocalStorage or Fallback to data.ts
  useEffect(() => {
    const savedUraian = localStorage.getItem(STORAGE_KEY);
    if (savedUraian) {
      try {
        setAllDataUraian(JSON.parse(savedUraian));
      } catch (e) {
        setAllDataUraian([...uraianAnggaran]);
      }
    } else {
      setAllDataUraian([...uraianAnggaran]);
    }

    const savedMeta = localStorage.getItem(KEGIATAN_META_KEY);
    if (savedMeta) {
      try {
        setKegiatanMeta(JSON.parse(savedMeta));
      } catch (e) {}
    }

    const savedLogs = localStorage.getItem('activity_logs');
    if (savedLogs) {
      try {
        setAllActivityLogs(JSON.parse(savedLogs));
      } catch (e) {}
    } else {
      // Mock initial logs
      setAllActivityLogs([
        { id: '1', timestamp: new Date(Date.now() - 86400000).toISOString(), user: 'Administrator Utama', action: 'Memperbarui Progress', details: 'Memperbarui tahapan Persiapan untuk Dokumen Perencanaan' },
        { id: '2', timestamp: new Date(Date.now() - 172800000).toISOString(), user: 'Administrator Utama', action: 'Menambahkan Kegiatan', details: 'Kegiatan baru: Evaluasi Kinerja Perangkat Daerah' }
      ]);
    }

    const savedUsers = localStorage.getItem('app_users');
    if (savedUsers) {
      try {
        setAppUsers(JSON.parse(savedUsers));
      } catch (e) {}
    } else {
      setAppUsers([
        {
          id: '1',
          nama: 'Administrator Utama',
          email: 'admin@dprd.go.id',
          password: 'admin',
          role: 'superadmin',
          bidangKode: 'ALL',
          status: 'Aktif',
          lastLogin: new Date().toISOString(),
        }
      ]);
    }
    
    setIsLoaded(true);
  }, []);

  // Save to LocalStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allDataUraian));
      localStorage.setItem(KEGIATAN_META_KEY, JSON.stringify(kegiatanMeta));
      localStorage.setItem('activity_logs', JSON.stringify(allActivityLogs));
      localStorage.setItem('app_users', JSON.stringify(appUsers));
    }
  }, [allDataUraian, kegiatanMeta, allActivityLogs, appUsers, isLoaded]);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const dataUraian = useMemo(() => {
    if (!user || user.role === 'superadmin' || !user.bidangKode || user.bidangKode === 'ALL') {
      return allDataUraian;
    }
    return allDataUraian.filter(u => u.kode === user.bidangKode || u.kode.startsWith(user.bidangKode + '.'));
  }, [allDataUraian, user]);

  const activityLogs = useMemo(() => {
    if (!user || user.role === 'superadmin') {
      return allActivityLogs;
    }
    return allActivityLogs.filter(log => log.user === user.nama);
  }, [allActivityLogs, user]);

  // Derived: Bagian List (Level 1)
  const getBagianList = (): Bagian[] => {
    return dataUraian
      .filter(u => u.level === 1)
      .map(u => {
        const progress = u.target > 0 ? Math.round((u.realisasi / u.target) * 100) : 0;
        let color = 'bg-gray-500';
        if (u.uraian.includes('Sekretariat')) color = 'bg-blue-500';
        if (u.uraian.includes('Umum')) color = 'bg-emerald-500';
        if (u.uraian.includes('Humas')) color = 'bg-orange-500';
        if (u.uraian.includes('Persidangan')) color = 'bg-purple-500';
        return {
          id: u.kode,
          nama: u.uraian,
          progress,
          warna: color
        };
      });
  };

  // Derived: Kegiatan List (Level 3 or Level 4 with custom metadata)
  const getKegiatanList = (): Kegiatan[] => {
    return dataUraian
      .filter(u => u.level === 3 || u.level === 4)
      .map((u, i) => {
        const parts = u.kode.split('.');
        const bidangKode = parts[0];
        const subBidangKode = parts.slice(0, 2).join('.');
        
        const parentBidang = dataUraian.find(x => x.kode === bidangKode);
        const parentSubBidang = dataUraian.find(x => x.kode === subBidangKode);
        
        // Find custom metadata if it exists
        const meta = kegiatanMeta.find(m => m.id === u.kode);
        
        const isTerlambat = i < 7;
        const dummyStart = `2026-05-01`;
        const dummyEnd = isTerlambat ? `2026-05-15` : `2026-06-30`;

        const defaultSteps = [
          { id: `s${u.kode}-1`, nama: 'Persiapan', selesai: true },
          { id: `s${u.kode}-2`, nama: 'Pelaksanaan', selesai: !isTerlambat },
          { id: `s${u.kode}-3`, nama: 'Evaluasi', selesai: !isTerlambat },
        ];

        const steps = meta?.steps && meta.steps.length > 0 ? meta.steps : defaultSteps;

        // Jika ada realisasi anggaran, progress dari budget. Jika tidak, dari steps.
        const budgetProgress = u.target > 0 ? Math.min(100, Math.round((u.realisasi / u.target) * 100)) : 0;
        const doneSteps = steps.filter(s => s.selesai).length;
        const stepProgress = steps.length > 0 ? Math.round((doneSteps / steps.length) * 100) : 0;
        const progress = budgetProgress > 0 ? budgetProgress : stepProgress;

        // Kegiatan dari master data otomatis approved.
        // Hanya kegiatan yang ditambahkan manual oleh admin (meta.createdByRole === 'admin') yang perlu approval superadmin.
        const createdByAdmin = meta?.createdByRole === 'admin';
        const isApproved = createdByAdmin ? (meta?.isApproved ?? false) : true;

        const now = new Date();
        const start = new Date(meta?.tanggalMulai || dummyStart);
        const end = new Date(meta?.tanggalSelesai || dummyEnd);
        const endWarning = new Date(end);
        endWarning.setDate(endWarning.getDate() - 3);

        let status = 'Belum Mulai';
        if (progress >= 100) {
          status = 'Selesai';
        } else if (now >= endWarning) {
          status = 'Terlambat';
        } else if (progress > 0 || now >= start) {
          status = 'Berjalan';
        }

        const step = progress >= 100 ? 'Closed' : progress >= 50 ? 'Pelaksanaan' : 'Persiapan';

        return {
          id: u.kode,
          nama: u.uraian,
          bidang: parentBidang?.uraian || 'Unknown',
          subBidang: parentSubBidang?.uraian || 'Unknown',
          penanggungJawab: meta?.penanggungJawab || 'Belum Ada PJ',
          tanggalMulai: meta?.tanggalMulai || dummyStart,
          tanggalSelesai: meta?.tanggalSelesai || dummyEnd,
          status,
          progress,
          paguAnggaran: u.target,
          realisasiAnggaran: u.realisasi,
          deskripsi: meta?.deskripsi || `Pelaksanaan kegiatan ${u.uraian}`,
          step,
          steps,
          isApproved,
          sumberDana: meta?.sumberDana || 'Belum ditentukan',
          anggaranDiminta: meta?.anggaranDiminta || 0,
        };
      });
  };

  // Derived: Agenda Hari Ini
  const getAgendaHariIni = () => {
    return getKegiatanList().slice(0, 4).map((k, i) => ({
      id: k.id,
      waktu: `${9 + i}:00`,
      status: i < 2 ? 'berlangsung' as const : 'terjadwal' as const,
      nama: k.nama,
      lokasi: 'Ruang Rapat',
      badge: i < 2 ? 'Berlangsung' : 'Terjadwal',
    }));
  };

  // Actions
  const addUraianBaru = (kode: string, uraian: string, level: 1|2|3|4, target: number, userName?: string) => {
    setAllDataUraian(prev => {
      // Avoid duplicate
      if (prev.some(u => u.kode === kode)) return prev;
      return [...prev, { kode, uraian, level, target, realisasi: 0 }];
    });
    if (userName) {
      addActivityLog({
        user: userName,
        action: 'Menambah Master Data',
        details: `Berhasil menambahkan data: ${uraian} (${kode})`
      });
    }
  };

  const updateUraian = (kode: string, uraianBaru: string, targetBaru: number, userName: string) => {
    setAllDataUraian(prev => {
      const idx = prev.findIndex(u => u.kode === kode);
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], uraian: uraianBaru, target: targetBaru };
        return next;
      }
      return prev;
    });
    addActivityLog({
      user: userName,
      action: 'Mengubah Master Data',
      details: `Data ${kode} diubah namanya menjadi ${uraianBaru} dengan pagu ${targetBaru}`
    });
  };

  const deleteUraian = (kode: string, userName: string) => {
    // Cascade delete: remove anything that starts with this kode
    // e.g. deleting '1' will delete '1.1', '1.1.1', etc.
    let deletedCount = 0;
    let deletedNames: string[] = [];
    setAllDataUraian(prev => {
      const next = prev.filter(u => {
        const isMatch = u.kode === kode || u.kode.startsWith(`${kode}.`);
        if (isMatch) {
          deletedCount++;
          deletedNames.push(u.uraian);
        }
        return !isMatch;
      });
      return next;
    });

    setKegiatanMeta(prev => prev.filter(m => !(m.id === kode || m.id.startsWith(`${kode}.`))));

    if (deletedCount > 0) {
      addActivityLog({
        user: userName,
        action: 'Menghapus Master Data',
        details: `Menghapus data ${kode} beserta ${deletedCount - 1} turunan. Terhapus: ${deletedNames[0]} dll.`
      });
    }
  };

  const deleteKegiatan = (id: string, userName: string, kegiatanNama: string) => {
    setKegiatanMeta(prev => prev.filter(m => m.id !== id));
    setAllDataUraian(prev => {
      const idx = prev.findIndex(u => u.kode === id);
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], realisasi: 0 };
        return next;
      }
      return prev;
    });

    addActivityLog({
      user: userName,
      action: 'Menghapus Agenda Kegiatan',
      details: `Agenda kegiatan ${kegiatanNama} (${id}) dihapus dan realisasi direset.`
    });
  };

  const deleteKegiatanMetadata = (kode: string) => {
    setKegiatanMeta(prev => prev.filter(m => m.id !== kode));
  };

  const addRealisasi = (kode: string, amount: number) => {
    setAllDataUraian(prev => {
      let currentKode = kode;
      const newData = [...prev];
      
      while (currentKode) {
        const index = newData.findIndex(u => u.kode === currentKode);
        if (index !== -1) {
          newData[index] = {
            ...newData[index],
            realisasi: newData[index].realisasi + amount
          };
        }
        const parts = currentKode.split('.');
        parts.pop();
        currentKode = parts.join('.');
      }
      return newData;
    });
  };

  const updateKegiatanMetadata = (meta: KegiatanMeta) => {
    setKegiatanMeta(prev => {
      const idx = prev.findIndex(m => m.id === meta.id);
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = meta;
        return next;
      }
      return [...prev, meta];
    });
  };

  const approveKegiatan = (id: string, userName: string) => {
    setKegiatanMeta(prev => {
      const idx = prev.findIndex(m => m.id === id);
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], isApproved: true };
        return next;
      }
      // If it doesn't exist, we can't approve it properly without the rest of the metadata,
      // but we could just create a skeleton metadata. Let's create one.
      const u = dataUraian.find(x => x.kode === id);
      if (!u) return prev;
      return [...prev, {
        id,
        penanggungJawab: 'Belum Ada PJ',
        tanggalMulai: new Date().toISOString().split('T')[0],
        tanggalSelesai: new Date().toISOString().split('T')[0],
        deskripsi: `Pelaksanaan kegiatan ${u.uraian}`,
        steps: [
          { id: `s${id}-1`, nama: 'Persiapan', selesai: false },
          { id: `s${id}-2`, nama: 'Pelaksanaan', selesai: false },
          { id: `s${id}-3`, nama: 'Evaluasi', selesai: false },
        ],
        isApproved: true
      }];
    });
    
    addActivityLog({
      user: userName,
      action: 'Approval Kegiatan',
      details: `Kegiatan ${id} disetujui`
    });
  };

  const addActivityLog = (log: Omit<ActivityLog, 'id' | 'timestamp'>) => {
    setAllActivityLogs(prev => [
      {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...log
      },
      ...prev
    ]);
  };

  const addUser = (newUser: Omit<AppUser, 'id' | 'lastLogin'>) => {
    setAppUsers(prev => [
      ...prev,
      {
        ...newUser,
        id: Date.now().toString(),
        lastLogin: '-'
      }
    ]);
  };

  const updateUser = (id: string, updatedData: Partial<Omit<AppUser, 'id'>>) => {
    setAppUsers(prev => prev.map(u => u.id === id ? { ...u, ...updatedData } : u));
  };

  const deleteUser = (id: string) => {
    setAppUsers(prev => prev.filter(u => u.id !== id));
  };

  return {
    isLoaded,
    dataUraian,
    kegiatanMeta,
    activityLogs,
    appUsers,
    getBagianList,
    getKegiatanList,
    getAgendaHariIni,
    addUraianBaru,
    updateUraian,
    deleteUraian,
    deleteKegiatan,
    deleteKegiatanMetadata,
    addRealisasi,
    updateKegiatanMetadata,
    approveKegiatan,
    addActivityLog,
    addUser,
    updateUser,
    deleteUser
  };
}
