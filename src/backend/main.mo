import Text "mo:core/Text";
import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Core Types
  type Service = {
    id : Nat;
    name : Text;
    description : Text;
    price : Nat; // in cents
    duration : Nat; // in minutes
    category : Text;
  };

  module Service {
    public func compare(service1 : Service, service2 : Service) : Order.Order {
      switch (Text.compare(service1.category, service2.category)) {
        case (#equal) { Text.compare(service1.name, service2.name) };
        case (order) { order };
      };
    };
  };

  type Stylist = {
    id : Nat;
    name : Text;
    bio : Text;
    specialties : [Text];
  };

  module Stylist {
    public func compare(stylist1 : Stylist, stylist2 : Stylist) : Order.Order {
      Text.compare(stylist1.name, stylist2.name);
    };
  };

  type AppointmentStatus = {
    #pending;
    #confirmed;
    #cancelled;
    #completed;
  };

  type Appointment = {
    id : Nat;
    customerName : Text;
    customerEmail : Text;
    customerPhone : Text;
    serviceId : Nat;
    stylistId : Nat;
    date : Int; // unix timestamp for date
    timeSlot : Text;
    status : AppointmentStatus;
    notes : ?Text;
  };

  module Appointment {
    public func compare(appointment1 : Appointment, appointment2 : Appointment) : Order.Order {
      Int.compare(appointment1.date, appointment2.date);
    };

    public func compareByStatus(appointment1 : Appointment, appointment2 : Appointment) : Order.Order {
      switch (Int.compare(appointment1.date, appointment2.date)) {
        case (#equal) { Text.compare(appointment1.timeSlot, appointment2.timeSlot) };
        case (order) { order };
      };
    };
  };

  type GalleryItem = {
    id : Nat;
    title : Text;
    description : Text;
    imageUrl : Text;
  };

  module GalleryItem {
    public func compare(galleryItem1 : GalleryItem, galleryItem2 : GalleryItem) : Order.Order {
      switch (Text.compare(galleryItem1.title, galleryItem2.title)) {
        case (#equal) { Text.compare(galleryItem1.description, galleryItem2.description) };
        case (order) { order };
      };
    };
  };

  module CompareBy {
    public func date(appointment1 : Appointment, appointment2 : Appointment) : Order.Order {
      Int.compare(appointment1.date, appointment2.date);
    };
  };

  public type UserProfile = {
    name : Text;
  };

  // Storage
  let services = Map.empty<Nat, Service>();
  let stylists = Map.empty<Nat, Stylist>();
  let appointments = Map.empty<Nat, Appointment>();
  let gallery = Map.empty<Nat, GalleryItem>();
  var nextAppointmentId = 1;
  let userProfiles = Map.empty<Principal, UserProfile>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Initialization function to preload services and stylists
  public shared ({ caller }) func initialize() : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    // Preload services only once
    if (services.isEmpty()) {
      let initialServices : [Service] = [
        {
          id = 1;
          name = "Women's Haircut";
          description = "Precision haircut with style and blow-dry";
          price = 5000;
          duration = 60;
          category = "Haircut";
        },
        {
          id = 2;
          name = "Men's Haircut";
          description = "Custom men's styling and grooming";
          price = 3500;
          duration = 45;
          category = "Haircut";
        },
        {
          id = 3;
          name = "Balayage";
          description = "Hand-painted highlights for natural look";
          price = 12000;
          duration = 180;
          category = "Coloring";
        },
        {
          id = 4;
          name = "Keratin Treatment";
          description = "Smoothing and frizz control treatment";
          price = 15000;
          duration = 120;
          category = "Treatment";
        },
      ];

      for (service in initialServices.values()) {
        services.add(service.id, service);
      };
    };

    // Preload stylists only once
    if (stylists.isEmpty()) {
      let initialStylists : [Stylist] = [
        {
          id = 1;
          name = "Rachel Smith";
          bio = "Senior stylist with 10 years experience";
          specialties = ["Balayage", "Women's Cuts"];
        },
        {
          id = 2;
          name = "Emily Turner";
          bio = "Expert in men's grooming and coloring";
          specialties = ["Men's Cuts", "Coloring"];
        },
        {
          id = 3;
          name = "Sarah Lee";
          bio = "Specializes in keratin treatments and blowouts";
          specialties = ["Treatments", "Blowouts"];
        },
        {
          id = 4;
          name = "Mia Johnson";
          bio = "Creative colorist with unique style";
          specialties = ["Creative Color", "Ombré"];
        },
      ];

      for (stylist in initialStylists.values()) {
        stylists.add(stylist.id, stylist);
      };
    };

    // Preload gallery items only once
    if (gallery.isEmpty()) {
      let initialGallery : [GalleryItem] = [
        {
          id = 1;
          title = "Balayage Highlight";
          description = "Before and after - seamless transitions";
          imageUrl = "https://example.com/image1.jpg";
        },
        {
          id = 2;
          title = "Men's Fade";
          description = "Clean and sharp look created by stylist";
          imageUrl = "https://example.com/image2.jpg";
        },
        {
          id = 3;
          title = "Women's Haircut";
          description = "Classic and modern blend";
          imageUrl = "https://example.com/image3.jpg";
        },
      ];

      for (item in initialGallery.values()) {
        gallery.add(item.id, item);
      };
    };
  };

  // Services/Product Management
  public query ({ caller }) func getAllServices() : async [Service] {
    services.values().toArray().sort();
  };

  public query ({ caller }) func getServiceById(serviceId : Nat) : async Service {
    switch (services.get(serviceId)) {
      case (null) { Runtime.trap("Service not found") };
      case (?service) { service };
    };
  };

  // Stylists Management
  public query ({ caller }) func getAllStylists() : async [Stylist] {
    stylists.values().toArray().sort();
  };

  public query ({ caller }) func getStylistById(stylistId : Nat) : async Stylist {
    switch (stylists.get(stylistId)) {
      case (null) { Runtime.trap("Stylist not found") };
      case (?stylist) { stylist };
    };
  };

  // Appointments Management
  public shared ({ caller }) func bookAppointment(
    customerName : Text,
    customerEmail : Text,
    customerPhone : Text,
    serviceId : Nat,
    stylistId : Nat,
    date : Int,
    timeSlot : Text,
    notes : ?Text,
  ) : async Appointment {
    let appointment : Appointment = {
      id = nextAppointmentId;
      customerName;
      customerEmail;
      customerPhone;
      serviceId;
      stylistId;
      date;
      timeSlot;
      status = #pending;
      notes;
    };

    appointments.add(appointment.id, appointment);
    nextAppointmentId += 1;
    appointment;
  };

  public query ({ caller }) func getAppointmentById(appointmentId : Nat) : async Appointment {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view appointments");
    };

    switch (appointments.get(appointmentId)) {
      case (null) { Runtime.trap("Appointment not found") };
      case (?appointment) { appointment };
    };
  };

  public query ({ caller }) func getAllAppointments() : async [Appointment] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all appointments");
    };

    appointments.values().toArray().sort();
  };

  public query ({ caller }) func getAppointmentsByDateRange(startDate : Int, endDate : Int) : async [Appointment] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view appointments");
    };

    appointments.values().toArray().sort(CompareBy.date);
  };

  public shared ({ caller }) func updateAppointmentStatus(appointmentId : Nat, newStatus : AppointmentStatus) : async Appointment {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    switch (appointments.get(appointmentId)) {
      case (null) { Runtime.trap("Appointment not found") };
      case (?appointment) {
        let updatedAppointment = {
          id = appointmentId;
          customerName = appointment.customerName;
          customerEmail = appointment.customerEmail;
          customerPhone = appointment.customerPhone;
          serviceId = appointment.serviceId;
          stylistId = appointment.stylistId;
          date = appointment.date;
          timeSlot = appointment.timeSlot;
          status = newStatus;
          notes = appointment.notes;
        };
        appointments.add(appointmentId, updatedAppointment);
        updatedAppointment;
      };
    };
  };

  // Gallery Management
  public query ({ caller }) func getAllGalleryItems() : async [GalleryItem] {
    gallery.values().toArray().sort();
  };

  public query ({ caller }) func getGalleryItemById(itemId : Nat) : async GalleryItem {
    switch (gallery.get(itemId)) {
      case (null) { Runtime.trap("Gallery item not found") };
      case (?item) { item };
    };
  };

  // Time Slot Management
  public query ({ caller }) func getAvailableTimeSlots(
    stylistId : Nat,
    date : Int,
  ) : async [Text] {
    let defaultSlots : [Text] = [
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
    ];

    // Find booked time slots for the stylist and date
    let bookedSlotsList = List.empty<Text>();
    for ((_, appointment) in appointments.entries()) {
      if (appointment.stylistId == stylistId and appointment.date == date) {
        bookedSlotsList.add(appointment.timeSlot);
      };
    };
    let bookedSlots = bookedSlotsList.toArray();

    // Filter out booked slots
    let availableSlotsList = List.empty<Text>();
    for (slot in defaultSlots.values()) {
      var isBooked = false;
      for (bookedSlot in bookedSlots.values()) {
        if (slot == bookedSlot) {
          isBooked := true;
        };
      };
      if (not isBooked) {
        availableSlotsList.add(slot);
      };
    };
    availableSlotsList.toArray();
  };
};
