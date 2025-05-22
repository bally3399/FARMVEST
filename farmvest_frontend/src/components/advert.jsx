import image from '../assets/img_1.png'
export default function Advert() {
    const years = [
        {year:'2024',text:'founded'},
        {year:'20,000',text:'farmers'},
        {year:'5000',text:'farms'},
        {year:'10,000',text:'Apps Download'},
    ]
    return (
        <div className={'flex flex-col sm:flex-row bg-green-700'}>
            <div className={'rounded-r-[300px] w-full md:w-[55%] overflow-hidden '}>
                <img src={image} alt="" className={'w-full h-full object-cover'}/>
            </div>
            <div className={'w-full sm:w-[45%] justify-center flex flex-col mb-[30px] px-[20px]'}>
                <p className={'text-[30px] text-white'}>Investing on Farm Owners, Expanding Reach, Thriving</p>
                <p className={'text-[13px] text-white py-[5px]'}>This  showcases the remarkable growth of our company, highlighting our
                    dedication to empowering farm owners while expanding our reach.
                </p>
                <section className={'py-[20px] columns-[150px] md:columns-[200px] gap-[20px]'}>
                    {
                        years.map((year, index)=>(
                            <div key={index} className={'items-start flex flex-col gap-[5px] w-full'}>
                                <p className={'text-white text-[18px]'}>{year.year}</p>
                                <p className={'text-white text-[13px]'}>{year.text}</p>
                            </div>
                        ))
                    }
                </section>
            </div>
        </div>
    )
}