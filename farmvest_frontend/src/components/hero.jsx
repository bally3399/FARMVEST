export default function Hero() {
    return (
        <div className={'h-[300px] md:h-[400px] justify-center items-center flex flex-col object-contain bg-cover'}
             style={{backgroundImage:'url(./img_3.png)', backgroundRepeat:'no-repeat', width:'100%'}}>
            <p className={'text-[20px] md:text-[25px] capitalize text-white font-[700] shadow-md'}>
                &#34;Harness the power of Investment to revolutionize your farming operation&#34;.
            </p>
            <p className={'text-[12px] text-white md:text-[17px]'}>
                &#34;Elevate your layer farming with actionable data insights. Maximize efficiency and productivity for a thriving poultry business.&#34;
            </p>
        </div>
    )
}