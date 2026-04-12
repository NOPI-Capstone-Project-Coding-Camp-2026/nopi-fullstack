import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '../components/ui/AppIcons';

const ForgotPassword = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#ee872d] px-6 py-10">
      <div className="w-full max-w-xl rounded-[26px] bg-[#fffaf5] px-10 py-12 shadow-[0_26px_46px_rgba(128,72,20,0.18)]">
        <h1 className="text-[2.8rem] font-semibold tracking-[-0.05em] text-[#2b2b2b]">
          Lupa Kata Sandi
        </h1>
        <p className="mt-4 max-w-lg text-[1.05rem] leading-9 text-[#8d8d8d]">
          Jangan khawatir, masukan email terdaftar Anda dan kami akan mengirimkan tautan untuk
          mengatur ulang kata sandi Anda
        </p>

        <div className="mt-10">
          <label className="mb-3 block text-lg font-semibold text-[#2b2b2b]">Email</label>
          <input
            type="email"
            placeholder="Isi email yang digunakan"
            className="w-full rounded-2xl bg-[#ededed] px-6 py-6 text-lg text-[#2b2b2b] outline-none placeholder:text-[#9b9b9b]"
          />
        </div>

        <button
          type="button"
          className="mt-10 w-full rounded-2xl bg-[#4e82ee] px-6 py-6 text-[1.15rem] font-semibold text-white transition hover:bg-[#3f74e1]"
        >
          Kirim Tautan Pemulihan →
        </button>

        <div className="mt-10 flex justify-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-3 text-base font-medium text-[#8f8f8f] transition hover:text-[#6d6d6d]"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Kembali ke Halaman Masuk
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
