import LocationOnIcon from '@mui/icons-material/LocationOn';
import {Button} from "@mui/material";

export default function Farm({image,farmName, address, farmDescription,amountNeeded,width}){
    return (
        <div className={`h-[350px] sm:h-[320px] rounded-md border-[1px] border-white w-[250px] lg:${width} my-[10px]`}>
            <div className={'p-[5px] h-[100px] w-[100%] overflow-hidden'}>
                <img src={image} alt="" className={'object-cover h-full w-full'}/>
            </div>
            <section className={'flex flex-col px-[12px] gap-[5px] sm:gap-[10px]'}>
                <p className={'text-white capitalize font-[730]'}>{farmName}</p>
                <article className={'flex gap-[10px]'}>
                    <LocationOnIcon/>
                    <p className={'text-white text-[13px]'}>{address}</p>
                </article>
                <div className={'flex flex-col gap-[10px]'}>
                    <p className='text-white max-h-[150px] text-ellipsis text-[14px]'>{farmDescription}</p>
                    <p className={'text-white text-[13px] font-[730]'}>N{amountNeeded}</p>
                </div>
                <div className={'flex items-center w-full justify-center'}>
                    <Button sx={{backgroundColor:'#117938',color:'#ffffff',width:'150px'}}>invest</Button>
                </div>
            </section>
        </div>
    )
}