import { HttpHeaders } from "@angular/common/http";

const domain = 'http://localhost:8080';
export const environment = {
  production: false,
  endpoints: {
    // Authentication
    authentication: domain + '/auth/login',

    // Update user status
    unsuscribeUser: domain + '/user/status/unsuscribe/',
    suscribeUser: domain + '/user/status/suscribe/',

    // Update password
    updatePassword: domain + '/credentials/update',
    
    // Registration
    adminRegistration: domain + '/register/admin',
    customerRegistration: domain + '/register/customer',
    teacherRegistration: domain + '/register/teacher',
    
    // Exercises
    exercisesGroupedByExerciseType: domain + '/exercises/type',
    exerciseType: domain + '/exercises_types',
    exercises: domain + '/exercises',

    // Users
    user: domain + '/users/user',

    // Customers
    paginatedCustomers: domain + '/customers',

    // Teachers
    paginatedTeachers: domain + '/teachers',
    paginatedByStatus: domain + '/teachers/status/',

    // Admins
    paginatedAdmins: domain + '/admins',

    // Routine
    routines: domain + '/routines',
    routinesByRoutineId: domain + '/routines/routine/',
    routinesByUserId: domain + '/routines/user/',

    // Classes
    classes: domain + '/classes',
    enableClasses: domain + '/classes/enable/',
    disableClasses: domain + '/classes/disable/',

    // Scheduled classes
    scheduledClasses: domain + '/classes/scheduled',
    cancelScheduledClass: domain + '/classes/scheduled/cancel/',

    // Scheduled classes inscriptions
    enrollToClass: domain + '/classes/scheduled/inscriptions/enroll/',
    eraseInscriptionClass: domain + '/classes/scheduled/inscriptions/erase/',
    getInscriptionsToScheduledClass: domain + '/classes/scheduled/inscriptions/',
    getInscriptionsToScheduledClassFromCustomerByUserId: domain + '/classes/scheduled/inscriptions/customer/',

    // Days
    days: domain + '/days',

     // Days
     schedules: domain + '/schedules',


    // Suscription payment
    getSuscriptionPayments: domain + '/suscriptions',
    getSuscriptionPaymentByUserId: domain + '/suscriptions/user/',
    postSuscriptionPayment: domain + '/suscriptions/suscription/user/',
    deleteSuscriptionPayment: domain + '/suscriptions/suscription/',

    // Forgot password
    forgotPasswordCodeGeneration: domain + '/password/recuperation/code/generation/',
    forgotPasswordCodeValidation: domain + '/password/recuperation/code/validation/',
    forgotPasswordPasswordUpdate: domain + '/password/recuperation/password/update/'
  }
}