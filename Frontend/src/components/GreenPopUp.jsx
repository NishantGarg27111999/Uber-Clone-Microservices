function GreenPopUp({content}){

    return(
        <div className={`z-7 absolute top-5 left-1/2 -translate-x-1/2 border-1 border-green-700 bg-green-200 text-green-800 px-4 py-2 rounded-lg  shadow-lg `}>
            {content}
        </div>
    )

}

export default GreenPopUp;