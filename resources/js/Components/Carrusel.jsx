import { Carousel } from "@material-tailwind/react";

export default function Carrusel() {
    return (
        <div className="mt-5 w-full">
            <div className="w-full h-[450px] rounded-xl overflow-hidden">
                <Carousel transition={{ duration: 2 }} className="rounded-xl">
                    <img
                        src="https://images.pexels.com/photos/7550450/pexels-photo-7550450.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                        alt="image 1"
                        className="h-full w-full object-center"
                    />
                    <img
                        src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                        alt="image 2"
                        className="h-full w-full object-center"
                    />
                    <img
                        src="https://images.pexels.com/photos/3810795/pexels-photo-3810795.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1 "
                        alt="image 3"
                        className="h-full w-full object-center"
                    />
                    <img
                        src="https://images.pexels.com/photos/1181370/pexels-photo-1181370.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1  "
                        alt="image 4"
                        className="h-full w-full object-center"
                    />
                </Carousel>
            </div>
        </div>
    );
}
