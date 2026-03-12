# Luxe Saloon Website

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Landing/hero section with saloon branding
- Services/products showcase (haircuts, coloring, treatments, etc.)
- Online appointment booking form (name, contact, service, date, time, stylist)
- Appointments management for admin (view/manage bookings)
- Stylists/team section
- Gallery section
- Contact info & location section

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend: Store appointments, services, stylists, gallery items
   - createAppointment(name, phone, email, service, date, time, stylist)
   - getAppointments() for admin
   - getServices() list of offered services/products
   - getStylists() list of team members
   - updateAppointmentStatus(id, status) for admin
2. Frontend: Multi-section single-page website
   - Sticky navbar with nav links
   - Hero section with CTA to book
   - Services/products grid
   - Team/stylists section
   - Online appointment booking form
   - Gallery section
   - Contact/footer section
   - Admin view to manage appointments (accessible via hidden route)
