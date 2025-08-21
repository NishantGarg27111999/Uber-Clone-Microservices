function RedPopUp({content}){

    return(
        <div className={`z-7 absolute top-5 text-center left-1/2 -translate-x-1/2 border-1 border-red-700 bg-red-200 text-red-800 px-4 py-2 rounded-lg  shadow-lg `}>
            {content}
        </div>
    )

}

export default RedPopUp;