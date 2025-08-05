const express=require('express');
const router=express.Router();
const authMiddleware=require('../middlewares/auth.middleware')
const {body, query}=require('express-validator');
const rideController=require('../controllers/ride.controller');



router.post('/create',
    authMiddleware.authUser,
    body('pickup').isString().isLength({min:3}).withMessage('Invalid pickup address'),
    body('destination').isString().isLength({min:3}).withMessage('Invalide destination address'),
    body('vehicleType').isString().isIn(['auto','car','bike']).withMessage('Invalide vehicle type'),
    rideController.createRide

)

router.get('/get-fare',
    authMiddleware.authUser,
    query('pickup').isString().isLength({min:3}).withMessage('Invalid pickup address'),
    query('destination').isString().isLength({min:3}).withMessage('Invalide destination address'),
    rideController.getFare
)

router.get('/confirm-ride',
    query('otp').isLength({min:6,max:6}).withMessage('Invalid OTP'),
    query('rideId').isMongoId().withMessage('Invalid ride ID'),
    rideController.confirmAndStartRide
)


router.get('/active-ride/:captainId',rideController.getActiveRide);

router.post('/accept-ride',
    body('rideId').isString().withMessage('Invalid rideId'),
    body('captainId').isString().withMessage('Invalid captainId'),
    rideController.acceptRide
)

router.get('/map/get-coordinates',rideController.getAddressCoordinate);
router.put('/:rideId/complete',rideController.finishRide);


module.exports=router;