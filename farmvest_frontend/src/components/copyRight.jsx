import copyRight from '../assets/copyright-removebg-preview 1.png';

const CopyRight = () => {
    return(
        <div className='w-full bg-background flex items-center justify-center pb-10 text-white'>
            <div className="flex gap-5 items-center self-center">
                <p className="font-bold">Copyright</p>
                <img className="w-[25px] h-[25px]" src={copyRight}/>
                <p className="font-bold">2024</p>
                <p className="font-bold">All Right’s Reserved</p>
            </div>
        </div>
    )
}

export default CopyRight