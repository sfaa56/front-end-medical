import { combineReducers } from "@reduxjs/toolkit";
import authReducer from '@/features/auth/authSlice';
import userReducer from '@/features/user/useSlice';
import clinicReducer from '@/features/clinic/clinicSlice'
import serviceRequestReducer from '@/features/ServiceRequests/ServiceRequestsSlice'
import  NotificationReducer  from "@/features/notification/notificationsSlice";
import ComplaintReducer from '@/features/complaint/complaintSlice' ;

const rootReducer = combineReducers({
    auth:authReducer,
    users:userReducer,
    clinics:clinicReducer,
    serviceRequests:serviceRequestReducer,
    notifications:NotificationReducer,
    complaints:ComplaintReducer
})


export default rootReducer;