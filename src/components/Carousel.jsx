import { faker } from "@faker-js/faker"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const slides = [
  {
    id: 1,
    image: "/img/product.webp",
    title: "Voucher Belanja Harian",
    description: "Temukan voucher diskon setiap hari untuk berbagai kebutuhan belanja, mulai dari potongan harga hingga promo spesial checkout.",
  },
  {
    id: 2,
    image: "/img/product1.avif",
    title: "Diskon Besar, Hemat Maksimal",
    description: "Gunakan kode voucher dengan mudah dan nikmati penghematan lebih besar untuk produk favoritmu tanpa ribet.",
  },
  {
    id: 3,
    image: "/img/product2.webp",
    title: "Promo Cerdas untuk Pelanggan Setia",
    description: "VoucherIn menghadirkan promo transparan, mudah digunakan, dan terstruktur untuk membantu kamu belanja lebih hemat setiap saat.",
  },
]


const CarouselBanner = () => {
  return (
    <div className="mx-auto mt-8 w-full max-w-6xl">
      <Carousel>
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.id}>
              <div className="relative aspect-video overflow-hidden rounded-lg">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />

                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-white">
                  <h2 className="mb-2 text-3xl font-bold">{slide.title}</h2>
                  <p className="max-w-md text-sm opacity-90">
                    {slide.description}
                  </p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
    </div>
  )
}

export default CarouselBanner