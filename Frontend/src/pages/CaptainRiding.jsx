import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import map from '../assets/map.gif'
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { useRef } from 'react';
import FinishRide from '../components/FinishRide';
import { useLocation } from 'react-router-dom';

function CaptainRiding() {
    function PanelOpenClose(panelRef) {
        panelRef.current.classList.toggle("translate-y-full");
    }

    const finishRidePanelRef=useRef(null);

    const location=useLocation();
        const ride=location.state?.ride;

    return (
        <div className='h-screen'>
            <img src={map} alt="map" className='h-4/5' />
            <div className='bg-yellow-400 h-1/5 p-4' onClick={()=>PanelOpenClose(finishRidePanelRef)}>
             <FontAwesomeIcon icon={faAngleUp} className='text-2xl w-full' onClick={(e) => {
                                                
                                            }} />
                <div className='flex justify-between items-center py-2'>
                    <div className='text-lg font-semibold'>4KM away</div>
                    <button className='px-8 py-2 bg-green-600 rounded-lg text-lg'>Complete Ride</button>
                </div>
            </div>

            <FinishRide finishRidePanelRef={finishRidePanelRef} ride={ride}/>
        </div>
    )
}

export default CaptainRiding;