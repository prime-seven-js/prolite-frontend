import qrVpbank from "/qr-vpbank.jpg";
import qrMb from "/qr-mbbank.jpg";
import qrTechcombank from "/qr-techcombank.jpg";

const Donate = () => {
    return (
        <div className="min-h-screen bg-gradient-blue flex flex-col items-center px-3 py-4 sm:px-4 sm:py-10" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
            <div className="max-w-3xl text-center mb-6 sm:mb-10 px-2">
                <p className="text-sm sm:text-lg md:text-xl font-medium text-white/90 leading-relaxed">
                    Tính năng này vẫn chưa được hoàn thiện do chưa có đủ kinh phí vì vậy
                    Team 7 chúng em thực sự rất cần những sự trợ giúp tài chính đến từ các
                    Shark đang ngồi xem xét sản phẩm của chúng em
                </p>
                <p className="mt-3 sm:mt-4 text-xs sm:text-sm italic text-white/70 font-light">- Em yêu JSClub -</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-start gap-4 sm:gap-6 w-full max-w-5xl px-2">
                {[
                    { src: qrVpbank, label: "VPBank" },
                    { src: qrMb, label: "MB Bank" },
                    { src: qrTechcombank, label: "Techcombank" },
                ].map((item) => (
                    <div
                        key={item.label}
                        className="rounded-2xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-sm p-2 sm:p-3"
                    >
                        <img
                            src={item.src}
                            alt={`QR ${item.label}`}
                            className="w-full rounded-xl object-cover"
                        />
                        <p className="text-center text-white/80 text-xs sm:text-sm font-semibold mt-2">{item.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Donate;
