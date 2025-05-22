import image2 from '../assets/img_2.png';
import Farm from "../reuseables/farm.jsx";

export default function RecentlyAdded(){
    const images = [image2,image2,image2] ;
    const names = ['Sunshine farm','Sunshine farm','Sunshine farm']
    const prices = ['250,000,000','250,000,000','250,000,000']
    const desc = [
        'Luxury, Comfort, Serenity at its peak!!! Are you looking for a place to call hom...' +
        'Luxury, Comfort, Serenity at its peak!!! Are you looking for a place to call hom...',
        'Luxury, Comfort, Serenity at its peak!!! Are you looking for a place to call hom...' +
        'Luxury, Comfort, Serenity at its peak!!! Are you looking for a place to call hom...',
        'Luxury, Comfort, Serenity at its peak!!! Are you looking for a place to call hom...' +
        'Luxury, Comfort, Serenity at its peak!!! Are you looking for a place to call hom...'
    ]
    const address = ['1b Sango Ota, Lagos','1b Sango Ota, Lagos','1b Sango Ota, Lagos']
    return (
        <div className={'sm:px-[30px]'}>
            <div>
                <p className={'text-[17px] text-white font-extrabold '}>Recently Added</p>
            </div>
            <div className={'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-around py-[15px]'}>
                {
                    names.map((name, index) => (
                    <Farm image={images[index]} key={index} farmName={names[index]} width={"w-[350px]"} farmDescription={desc[index]}
                          amountNeeded={prices[index]} address={address[index]}/>))
                }
            </div>
        </div>
    )
}
