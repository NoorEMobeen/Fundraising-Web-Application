module.exports={
    REQUESTS_COLLECTION:'requests',
    REQUESTS_CANCELLED_COLLECTION:'cancelled',
    REQUESTS_FULFILLED_COLLECTION:'fulfilled',
    REQUESTS_REJECTED_COLLECTION:'rejected',

    CAMPAIGNS_COLLECTION:'campaigns',
    STUDENTS_PROFILE_DATA_COLLECTION:'students_data',
    
    TRANSACTIONS_COLLECTION:'transactions',
    DONOR_TRANSACTIONS_COLLECTION:'donor_transactions',
    MY_TRANSACTIONS_COLLECTION:'my_transactions',
    
    DONOR_PROFILE_DATA_COLLECTION:'donor_profiles',
    DONOR_DONATIONS_DATA_COLLECTION:'my_donations',
    DONATIONS_DATA_COLLECTION:'donations',
    
    STUDENT_ACTIVE_REQUEST_OBJECT_REALTIME_DB:'active_requests',
    STUDENT_PENDING_REQUEST_OBJECT_REALTIME_DB:'pending_requests',
    STUDENT_PAUSED_REQUEST_OBJECT_REALTIME_DB:'paused_requests',
    
    REPORT_REQUEST_COLLECTION:'request',
    REPORT_DONATION_COLLECTION:'donation',
    REPORT_PROFILE_COLLECTION:'profile',
    REPORT_TRANSACTION_COLLECTION:'transaction',
    REPORT_ERRORS_COLLECTION:'errors',
    REPORT_CREATES_COLLECTION:'creates',
    REPORT_UPDATES_COLLECTION:'updates',
    REPORT_RETRIEVES_COLLECTION:'retrieves',
    REPORT_DELETES_COLLECTION:'deletes',

    WITHDRAW_COLLECCTION:'withdraws',

    ROLES:{
        STUDENT:'student',
        DONOR:'donor',
        ADMIN:'admin',
        ALL_ROLES:['student','donor','admin']
    },

    CAMPAIGN_STATUS:{
        ACTIVE:'active',
        PAUSED:'paused',
        CANCELLED:'cancelled',
        FULFILLED:'fulfilled',
        REJECTED:'rejected',
        PENDING:'pending',
    }
}