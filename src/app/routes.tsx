import { createBrowserRouter } from "react-router";
import { Login } from "./components/Login";
import { DashboardLayout } from "./components/DashboardLayout";
import { Dashboard } from "./components/Dashboard";
import { AgendaKegiatan } from "./components/AgendaKegiatan";
import { KalenderKegiatan } from "./components/KalenderKegiatan";
import { ProgressKegiatan } from "./components/ProgressKegiatan";
import { AnggaranRealisasi } from "./components/AnggaranRealisasi";
import { LaporanKegiatan } from "./components/LaporanKegiatan";
import { LaporanAnggaran } from "./components/LaporanAnggaran";
import { RoleAkses } from "./components/RoleAkses";
import { MasterData } from "./components/MasterData";
import { DetailKegiatan } from "./components/DetailKegiatan";
import { RealisasiPage } from "./components/RealisasiPage";
import { LogAktifitas } from "./components/LogAktifitas";
import { PengaturanAkun } from "./components/PengaturanAkun";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    Component: DashboardLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "agenda", Component: AgendaKegiatan },
      { path: "agenda/:id", Component: DetailKegiatan },
      { path: "kalender", Component: KalenderKegiatan },
      { path: "progress", Component: ProgressKegiatan },
      { path: "anggaran", Component: AnggaranRealisasi },
      { path: "anggaran/realisasi", Component: RealisasiPage },
      { path: "laporan-kegiatan", Component: LaporanKegiatan },
      { path: "laporan-anggaran", Component: LaporanAnggaran },
      { path: "role-akses", Component: RoleAkses },
      { path: "master-data", Component: MasterData },
      { path: "log-aktifitas", Component: LogAktifitas },
      { path: "pengaturan-akun", Component: PengaturanAkun },
    ],
  },
]);
