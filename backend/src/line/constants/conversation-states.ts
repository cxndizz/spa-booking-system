// Conversation states for managing user flows
export enum ConversationState {
  // Idle state
  IDLE = 'IDLE',

  // Registration flow
  REGISTRATION_PHONE = 'REGISTRATION_PHONE',
  REGISTRATION_EMAIL = 'REGISTRATION_EMAIL',
  REGISTRATION_CONFIRM = 'REGISTRATION_CONFIRM',

  // Booking flow
  BOOKING_SELECT_SERVICE = 'BOOKING_SELECT_SERVICE',
  BOOKING_SELECT_DATE = 'BOOKING_SELECT_DATE',
  BOOKING_SELECT_TIME = 'BOOKING_SELECT_TIME',
  BOOKING_CONFIRM = 'BOOKING_CONFIRM',
  BOOKING_NOTES = 'BOOKING_NOTES',

  // Course purchase flow
  COURSE_SELECT = 'COURSE_SELECT',
  COURSE_VIEW_DETAILS = 'COURSE_VIEW_DETAILS',
  COURSE_CONFIRM_PURCHASE = 'COURSE_CONFIRM_PURCHASE',

  // Profile update flow
  PROFILE_UPDATE_PHONE = 'PROFILE_UPDATE_PHONE',
  PROFILE_UPDATE_EMAIL = 'PROFILE_UPDATE_EMAIL',
}

// Postback action types for Rich Menu and Quick Replies
export enum PostbackAction {
  // Main menu actions
  REGISTER = 'action=register',
  LOGIN = 'action=login',
  BOOK_SERVICE = 'action=book_service',
  VIEW_SERVICES = 'action=view_services',
  MY_BOOKINGS = 'action=my_bookings',
  BUY_COURSE = 'action=buy_course',
  MY_PROFILE = 'action=my_profile',
  CONTACT_US = 'action=contact_us',

  // Service selection
  SELECT_SERVICE = 'action=select_service',
  SELECT_CATEGORY = 'action=select_category',

  // Date/Time selection
  SELECT_DATE = 'action=select_date',
  SELECT_TIME = 'action=select_time',

  // Confirmation actions
  CONFIRM_BOOKING = 'action=confirm_booking',
  CANCEL_BOOKING = 'action=cancel_booking',
  CONFIRM_REGISTRATION = 'action=confirm_registration',
  CONFIRM_PURCHASE = 'action=confirm_purchase',

  // Navigation
  BACK = 'action=back',
  CANCEL = 'action=cancel',
  SKIP = 'action=skip',
}

// Rich Menu action areas
export enum RichMenuAction {
  REGISTER = 'richmenu://register',
  BOOK = 'richmenu://book',
  MY_BOOKINGS = 'richmenu://mybookings',
  SERVICES = 'richmenu://services',
  PROFILE = 'richmenu://profile',
  CONTACT = 'richmenu://contact',
}
