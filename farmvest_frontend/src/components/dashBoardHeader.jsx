import logo from '../assets/image 77.png'

const DashBoardHeader = ()=>{
    return(
        <main className="hidden lg:block flex-row items-center gap-3 border-b-1 border-white w-full bg-background1 py-6 px-4">
            <div className="flex items-center gap-3">
                <img className="" src={logo} alt="logo"/>
                <p className="text-3xl font-serif font-extrabold text-green-700">GreenChain</p>
            </div>

        </main>
    )
}

export default DashBoardHeader