import { UploadCloudIcon } from '../ui/AppIcons';

const UploadBox = () => {
  return (
    <div className="rounded-[30px] border border-dashed border-[#9b9b9b] bg-white px-8 py-12 shadow-[0_12px_28px_rgba(15,23,42,0.05)]">
      <div className="flex min-h-[560px] flex-col items-center justify-center rounded-[26px] border border-dashed border-[#a4a4a4] bg-[#fcfcfc] text-center">
        <UploadCloudIcon className="h-28 w-28 text-[#9a9a9a]" />
        <h3 className="mt-8 text-[3rem] font-semibold tracking-[-0.04em] text-[#666666]">
          Tarik Nota Anda di sini
        </h3>
        <p className="mt-2 text-xl text-[#9c9c9c]">PNG, JPG atau PDF (Maks. 10MB)</p>

        <button
          type="button"
          className="mt-12 rounded-full bg-[#d9d9d9] px-12 py-6 text-[1.8rem] font-medium text-[#3f4b59] transition hover:bg-[#cfcfcf]"
        >
          Pilih dari File
        </button>
      </div>
    </div>
  );
};

export default UploadBox;
