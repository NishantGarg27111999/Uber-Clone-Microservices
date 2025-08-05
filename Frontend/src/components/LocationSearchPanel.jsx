import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot, faAngleDown } from '@fortawesome/free-solid-svg-icons'


function LocationSearchPanel({ locationRef, suggestions, activeField,setRideData }) {
    const handleSuggestionClick=(elm)=>{
        console.log("i m executing");
        if(activeField=="pickup"){
            console.log("inside pickup");
            setRideData((prev)=>({
                ...prev,
                pickUp:elm
            }))
            
        }
        else{
            setRideData((prev)=>({
                ...prev,
                destination:elm
            }))
        }
    }

    return (


        <div ref={locationRef} className='-my-0.5   px-4 h-0  transition-all duration-1500 
                        ease-in-out overflow-hidden bg-white'>
            <div className='h-[100%] overflow-scroll'>
                {
                    suggestions.map((elm, idx) => {
                        return (
                            <div key={idx} className='py-2 px-4 my-2  flex items-center gap-4 bg-gray-200 rounded-lg ' onClick={(e)=>handleSuggestionClick(elm.description)}>
                                <FontAwesomeIcon icon={faLocationDot} className='text-xl' />
                                <p className='text-lg overflow-hidden'>{elm.description}</p>
                            </div>
                        )
                    })
                }

                

            </div>



        </div>
    )
}

export default LocationSearchPanel;