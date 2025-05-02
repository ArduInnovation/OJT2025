from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.hashers import make_password, check_password
from django.http import JsonResponse
from .models import Staff, Members

from .models import Child, Beneficiary, WorkDetail, GovernmentOffice, HistoryList


from django.views.decorators.csrf import csrf_protect, csrf_exempt

from django.contrib.auth import authenticate, login as auth_login

from django.db import IntegrityError

from django.db import transaction


from django.shortcuts import get_object_or_404

from django.contrib import messages

from datetime import datetime




def get_staff_list(request):
    staff = list(Staff.objects.values('id', 'staff_name'))  # Get all staff
    print("DEBUG: Staff List:", staff)  # Print staff list to console
    return JsonResponse(staff, safe=False)


def get_offices(request):
    offices = list(GovernmentOffice.objects.values('id', 'office_code'))
    return JsonResponse({'offices': offices})

def get_member_data(request, employment_id):
    try:
        members = Members.objects.get(employment_id=employment_id)
        # Get the Staff object
        staff = members.Staff_Approved_by  # Directly getting the Staff object
        staff_id = staff.id if staff else None
        staff_name = staff.staff_name if staff else "Not Assigned"


        # Fetching related child records
        children = [
            {
                "child_name": child.name,
                "child_birth_date": child.birth_date.strftime("%Y-%m-%d"),
            }
            for child in members.child_records.all()
        ]

        # Fetching work details with ForeignKey reference
        work_details = [
            {
                "office_id": work.office_name.id if work.office_name else None,  # Store ID for dropdown
                "office_name": work.office_name.office_code if work.office_name else "N/A",
                "service_record": work.service_record,
                "pgb_id_no": work.pgb_id_no,
                "tin_no": work.tin_no,
                "start_date": work.start_date.strftime("%Y-%m-%d") if work.start_date else None,
                "end_date": work.end_date.strftime("%Y-%m-%d") if work.end_date else None,
                "position": work.position,
                "salary": str(work.salary) if work.salary else None,
                "appointment_status": work.get_appointment_status_display(),
            }
            for work in members.work_details.all()
        ]

        # Fetching related beneficiaries
        beneficiaries = [
            {
                "full_name": beneficiary.full_name,
                "age": beneficiary.age,
                "relationship": beneficiary.get_relationship_display(),
            }
            for beneficiary in members.beneficiaries.all()
        ]

        # Constructing the response data
        data = {
            "employment_id": members.employment_id,  # ✅ Ensure this is included staff_emp_id
            "username": members.username,
            "password": members.password,
            "first_name": members.first_name,
            "last_name": members.last_name,
            "middle_name": members.middle_name,
            "nickname": members.nickname,
            "date_of_birth": members.date_of_birth.strftime("%Y-%m-%d"),
            "age": members.age,
            "civil_status": members.civil_status,
            "sex": members.sex,
            "spouse_name": members.spouse_name,
            "phone_number": members.phone_number,
            "email_address": members.email_address,
            "address_province": members.address_province,
            "address_city": members.address_city,
            "address_street": members.address_street,
            "father_name": members.father_name,
            "mother_name": members.mother_name,
            "has_children": members.has_children,
            "school_name": members.school_name,
            "degree_units": members.degree_units,
            "edu_start_date": members.edu_start_date.strftime("%Y-%m-%d") if members.edu_start_date else None,
            "edu_end_date": members.edu_end_date.strftime("%Y-%m-%d") if members.edu_end_date else None,
            "honors_received": members.honors_received,
            # ✅ Corrected Staff Approved By
            "Staff_Approved_by": staff_id,  # ID for dropdown
            "Staff_Approved_by_name": staff_name,  # Name for display

            "res_certificate_no": members.Res_Certificate_no,
            "issued_date": members.Issued_date.strftime("%Y-%m-%d") if members.Issued_date else None,

            # Added child details
            "children": children,

            # Added work details
            "work_details": work_details,

            # Added beneficiaries
            "beneficiaries": beneficiaries,
        }

        return JsonResponse(data)

    except Members.DoesNotExist:
        return JsonResponse({"error": "Member not found"}, status=404)






def update_member(request, employment_id):
    now = datetime.now()
    formatted_timestamp = now.strftime("%b %d, %Y, %I:%M %p")

    if not employment_id:
        return JsonResponse({'error': 'Missing member ID'}, status=400)
    member = get_object_or_404(Members, employment_id=employment_id)

    if request.method == "POST":
        try:
            # Update member fields

            member.username = request.POST.get("username")
            member.password = make_password(request.POST.get("password"))
            member.first_name = request.POST.get("first_name")
            member.last_name = request.POST.get("last_name")
            member.middle_name = request.POST.get("middle_name")
            member.nickname = request.POST.get("nickname")
            member.date_of_birth = request.POST.get("date_of_birth")
            member.age = request.POST.get("age")
            member.civil_status = request.POST.get("civil_status")
            member.sex = request.POST.get("sex")
            member.spouse_name = request.POST.get("spouse_name")
            member.phone_number = request.POST.get("phone_number")
            member.email_address = request.POST.get("email_address")
            member.address_province = request.POST.get("address_province")
            member.address_city = request.POST.get("address_city")
            member.address_street = request.POST.get("address_street")
            member.father_name = request.POST.get("father_name")
            member.mother_name = request.POST.get("mother_name")
            member.has_children = request.POST.get("has_children") == "on"
            member.save()

            # Update Child Details
            Child.objects.filter(employment_id=member).delete()
            child_names = request.POST.getlist("child_name")
            child_birth_dates = request.POST.getlist("child_birth_date")
            for name, birth_date in zip(child_names, child_birth_dates):
                if name and birth_date:
                    Child.objects.create(employment_id=member, name=name, birth_date=birth_date)

            # Update Beneficiaries
            Beneficiary.objects.filter(employment_id=member).delete()
            beneficiary_names = request.POST.getlist("beneficiary_full_name[]")
            beneficiary_ages = request.POST.getlist("beneficiary_age[]")
            beneficiary_relationships = request.POST.getlist("beneficiary_relationship[]")

            for full_name, age, relationship in zip(beneficiary_names, beneficiary_ages, beneficiary_relationships):
                if full_name and age and relationship:
                    Beneficiary.objects.create(
                        employment_id=member,
                        full_name=full_name,
                        age=int(age),
                        relationship=relationship
                    )

            # Handle Work Details
            # Handle Work Details
            work_details = WorkDetail.objects.filter(employment_id=member)

            office_ids = request.POST.getlist("office_name")
            service_records = request.POST.getlist("service_record")
            pgb_id_nos = request.POST.getlist("pgb_id_no")
            tin_nos = request.POST.getlist("tin_no")
            start_dates = request.POST.getlist("start_date")
            end_dates = request.POST.getlist("end_date")
            positions = request.POST.getlist("position")
            salaries = request.POST.getlist("salary")
            appointment_statuses = request.POST.getlist("appointment_status")

            # Delete existing work details
            work_details.delete()

            # Create new work details
            for i in range(len(office_ids)):
                work_detail = WorkDetail(
                    employment_id=member,
                    office_name=GovernmentOffice.objects.get(office_code=office_ids[i]),
                    service_record=service_records[i],
                    pgb_id_no=pgb_id_nos[i],
                    tin_no=tin_nos[i],
                    start_date=start_dates[i],
                    end_date=end_dates[i],
                    position=positions[i],
                    salary=salaries[i],
                    appointment_status=appointment_statuses[i]
                )
                work_detail.save()
                print("Work detail created:", work_detail)

            # Update Educational Background
            member.school_name = request.POST.get("school_name")
            member.degree_units = request.POST.get("degree_units")
            member.edu_start_date = request.POST.get("edu_start_date")
            member.edu_end_date = request.POST.get("edu_end_date")
            member.honors_received = request.POST.get("honors_received")
            member.save()
            HistoryList.objects.create(date=now, staff_name=request.session["staff_name"], action=f"updated member {member.first_name}")

            # Update Staff Approval
            staff_approved_by_id = request.POST.get("staff_approved_by")
            res_certificate_no = request.POST.get("res_certificate_no")
            issued_date = request.POST.get("issued_date")

            if staff_approved_by_id:
                try:
                    staff_approved_by = Staff.objects.get(id=staff_approved_by_id)

                    member.Res_Certificate_no = res_certificate_no
                    member.Issued_date = issued_date
                    member.save()
                except Staff.DoesNotExist:
                    return JsonResponse({"success": False, "error": "Selected staff does not exist"}, status=400)

            return JsonResponse({"success": True, "message": "Member updated successfully!"})

        except IntegrityError:
            return JsonResponse({"success": False, "error": "An error occurred while updating"}, status=400)

    return JsonResponse({"success": False, "error": "Invalid request method"}, status=400)



def register(request):
    now = datetime.now()
    formatted_timestamp = now.strftime("%b %d, %Y, %I:%M %p")

    if request.method == "POST":
        # Retrieve form data
        username = request.POST.get("username")
        password = request.POST.get("password")
        first_name = request.POST.get("first_name")
        last_name = request.POST.get("last_name")
        middle_name = request.POST.get("middle_name")
        nickname = request.POST.get("nickname")
        date_of_birth_str = request.POST.get("date_of_birth")
        # Handle empty date_of_birth
        date_of_birth = None
                
        if Members.objects.filter(username=username).exists() or Members.objects.filter(first_name=first_name).exists():
            return render(request, 'ims/dashboard.html', {'error': 'Username or first name already exists'})

        if date_of_birth_str and date_of_birth_str.strip():
            try:
                # Validate date format
                from datetime import datetime
                date_of_birth = datetime.strptime(date_of_birth_str, "%Y-%m-%d").date()
            except ValueError:
                return render(request, 'ims/dashboard.html', {'error': 'Date of birth must be in YYYY-MM-DD format'})

        age = request.POST.get("age")
        civil_status = request.POST.get("civil_status")
        sex = request.POST.get("sex")
        spouse_name = request.POST.get("spouse_name")
        phone_number = request.POST.get("phone_number")
        email_address = request.POST.get("email_address")
        address_province = request.POST.get("address_province")
        address_city = request.POST.get("address_city")
        address_street = request.POST.get("address_street")
        father_name = request.POST.get("father_name")
        mother_name = request.POST.get("mother_name")
        has_children = request.POST.get("has_children") == "on"

        # Check if username exists
        if Members.objects.filter(username=username).exists():
            return render(request, 'ims/dashboard.html', {'error': 'Username already exists'})

        try:
            # Create new member
            member = Members.objects.create(
                username=username,
                password=make_password(password),
                first_name=first_name,
                last_name=last_name,
                middle_name=middle_name,
                nickname=nickname,
                date_of_birth=date_of_birth,  # Now properly validated
                age=age,
                civil_status=civil_status,
                sex=sex,
                spouse_name=spouse_name,
                phone_number=phone_number,
                email_address=email_address,
                address_province=address_province,
                address_city=address_city,
                address_street=address_street,
                father_name=father_name,
                mother_name=mother_name,
                has_children=has_children
            )
            HistoryList.objects.create(date=now, staff_name=request.session["staff_name"], action=f"added an employee named {member.first_name}")
            # Save member object
            member.save()

            # Handle Child Details
            child_names = request.POST.getlist("child_name") or ['NA']
            child_birth_dates = request.POST.getlist("child_birth_date")  or ['11-11-1111']
            for name, birth_date in zip(child_names, child_birth_dates):
                if name and birth_date:
                    Child.objects.create(employment_id=member, name=name, birth_date=birth_date)

                # Handle Beneficiary Details
            beneficiary_full_names = request.POST.getlist("beneficiary_full_name[]") or ['NA']# ✅ FIXED ✅
            beneficiary_ages = request.POST.getlist("beneficiary_age[]")
            beneficiary_relationships = request.POST.getlist("beneficiary_relationship[]")

            print("Beneficiary Data Received:", beneficiary_full_names, beneficiary_ages, beneficiary_relationships)

            # Save Beneficiaries
            for full_name, age, relationship in zip(beneficiary_full_names, beneficiary_ages, beneficiary_relationships):
                if full_name and age and relationship:
                    try:
                        age = int(age)  # Convert to integer
                        beneficiary = Beneficiary.objects.create(
                            employment_id=member,
                            full_name=full_name,
                            age=age,
                            relationship=relationship
                        )
                        print(f"Saved Beneficiary: {beneficiary.full_name}, {beneficiary.age}, {beneficiary.relationship}")
                    except Exception as e:
                        print(f"Error saving beneficiary: {e}")

            # Handle Work Details
            # Handle Work Details
            # Debug: Print full POST data
            print(f" FULL POST DATA: {request.POST}")

            # Extract Work Details
            office_ids = request.POST.getlist("office_name")
            service_records = request.POST.getlist("service_record")
            pgb_id_nos = request.POST.getlist("pgb_id_no")
            tin_nos = request.POST.getlist("tin_no")
            start_dates = request.POST.getlist("start_date")
            end_dates = request.POST.getlist("end_date")
            positions = request.POST.getlist("position")
            salaries = request.POST.getlist("salary")
            appointment_statuses = request.POST.getlist("appointment_status")

            # Debug: Print extracted data
            print(f" Extracted Work Details: {office_ids}, {service_records}, {positions}")

            # Ensure all lists have the same length
            min_length = min(
                len(office_ids), len(service_records), len(pgb_id_nos),
                len(tin_nos), len(start_dates), len(end_dates),
                len(positions), len(salaries), len(appointment_statuses)
            )

            # Save Work Details in a Transaction
            with transaction.atomic():
                for i in range(min_length):
                    try:
                        work_detail = WorkDetail.objects.create(
                            employment_id=member,
                            service_record=int(service_records[i]) if service_records[i].isdigit() else None,
                            pgb_id_no=pgb_id_nos[i].strip(),
                            tin_no=int(tin_nos[i]) if tin_nos[i].isdigit() else None,
                            start_date=None if not start_dates[i].strip() else start_dates[i].strip(),
                            end_date=None if not end_dates[i].strip() else end_dates[i].strip(),
                            position=positions[i].strip(),
                            salary=float(salaries[i]) if salaries[i].replace(".", "", 1).isdigit() else None,
                            appointment_status=appointment_statuses[i].strip(),
                        )
                        office_name_id = office_ids[i]
                        if office_name_id:
                            try:
                                office_name = GovernmentOffice.objects.get(id=office_name_id)  # Fetch government office
                                work_detail.office_name = office_name  # Assign government office to work detail
                                work_detail.save()
                            except GovernmentOffice.DoesNotExist:
                                print("Error: Government office does not exist")
                        print(f" Work Detail Saved: {work_detail}")
                    except Exception as e:
                        print(f" ERROR saving Work Detail: {e}")



            # Handle Education Background (Fixed naming issues ✅)
            member.school_name = request.POST.get("school_name")
            member.degree_units = request.POST.get("degree_units")
            # Handle education start_date
            edu_start_date_str = request.POST.get("edu_start_date")
            if edu_start_date_str and edu_start_date_str.strip():
                try:
                    from datetime import datetime
                    member.edu_start_date = datetime.strptime(edu_start_date_str, "%Y-%m-%d").date()
                except ValueError:
                    member.edu_start_date = None
            else:
                member.edu_start_date = None

            # Handle education end_date
            edu_end_date_str = request.POST.get("edu_end_date")
            if edu_end_date_str and edu_end_date_str.strip():
                try:
                    from datetime import datetime
                    member.edu_end_date = datetime.strptime(edu_end_date_str, "%Y-%m-%d").date()
                except ValueError:
                    member.edu_end_date = None
            else:
                member.edu_end_date = None
            member.honors_received = request.POST.get("honors_received")
            member.save()

            # Handle Staff Approval (Fixed field names ✅)
            staff_approved_by_id = request.POST.get("staff_approved_by")
            res_certificate_no = request.POST.get("res_certificate_no")
            issued_date = request.POST.get("issued_date")

            if staff_approved_by_id:
                try:
                    staff_approved_by = Staff.objects.get(id=staff_approved_by_id)  # Fetch staff
                    member.Staff_Approved_by = staff_approved_by  # FIXED ✅
                    member.Res_Certificate_no = res_certificate_no  # FIXED ✅
                    # Handle issued_date
                    if issued_date and issued_date.strip():
                        try:
                            from datetime import datetime
                            member.Issued_date = datetime.strptime(issued_date, "%Y-%m-%d").date()
                        except ValueError:
                            member.Issued_date = None
                    else:
                        member.Issued_date = None
                    member.save()
                except Staff.DoesNotExist:
                    return render(request, 'ims/dashboard.html', {'error': 'Selected staff does not exist'})

            # Redirect to dashboard after successful registration
            return redirect("dashboard")

        except IntegrityError:
            return render(request, 'ims/dashboard.html', {'error': 'An error occurred during registration'})

    return render(request, 'ims/dashboard.html')

















@csrf_protect
def login(request):
    now = datetime.now()
    formatted_timestamp = now.strftime("%b %d, %Y, %I:%M %p")

    if request.method == "POST":
        staff_name = request.POST.get("username")
        staff_pass = request.POST.get("password")

        print(f"DEBUG: Attempting login for staff_name: {staff_name}")

        try:
            staff = Staff.objects.get(staff_name=staff_name)
            print(f"DEBUG: Staff found: {staff.staff_name}")

            if check_password(staff_pass, staff.staff_pass):
                print("DEBUG: Password match successful!")

                request.session["staff_emp_id"] = staff.staff_emp_id  # Store in session
                request.session["staff_name"] = staff.staff_name  # Store staff name for display

                auth_login(request, staff)  # Log the user in
                HistoryList.objects.create(date=now, staff_name=request.session["staff_name"], action="has been logged in")
                return redirect("dashboard")  # Redirect to dashboard

            else:
                print("DEBUG: Password did NOT match.")
                messages.error(request, "Incorrect password. Please try again.")

        except Staff.DoesNotExist:
            print("DEBUG: Staff not found.")
            messages.error(request, "User not found. Please check your username.")

    print("DEBUG: Reloading login page")
    return render(request, "ims/login_new.html")



def dashboard(request):
    # Debug: Print session data
    print("DEBUG: Session Data:", request.session)

    if "staff_emp_id" not in request.session:  # Ensure staff is logged in
        print("DEBUG: staff_emp_id not found in session, redirecting to login.")
        return redirect("login")

    try:
        staff = Staff.objects.get(staff_emp_id=request.session["staff_emp_id"])  # Get logged-in staff
        print(f"DEBUG: Logged-in Staff - Name: {staff.staff_name}, ID: {staff.staff_emp_id}")
    except Staff.DoesNotExist:
        print("DEBUG: Staff with this ID does not exist.")
        return redirect("login")

    members = Members.objects.all()  # Fetch all members
    print(f"DEBUG: Total Members Found: {members.count()}")

    history_list = HistoryList.objects.all().order_by('-date')  # Fetch all history

    return render(request, "ims/dashboard_new.html", {"staff": staff, "members": members, "history_list": history_list})


@csrf_protect
def logout(request):
    now = datetime.now()
    formatted_timestamp = now.strftime("%b %d, %Y, %I:%M %p")

    if request.method == "POST":
        HistoryList.objects.create(date=now,staff_name=request.session["staff_name"], action=f"has logged out")
        request.session.flush()
        return redirect("login")
    return redirect("home")  # Redirect to home if accessed via GET


@csrf_protect
def delete_member(request):
    now = datetime.now()
    formatted_timestamp = now.strftime("%b %d, %Y, %I:%M %p")
    if request.method == "POST":
        try:
            # Get the list of member IDs to delete
            member_ids = request.POST.getlist("member_ids[]")

            if not member_ids:
                return JsonResponse({"success": False, "error": "No members selected for deletion"}, status=400)

            # Keep track of deleted members for the response
            deleted_members = []

            # Delete each member
            for member_id in member_ids:
                try:
                    member = Members.objects.get(employment_id=member_id)
                    member_name = f"{member.first_name} {member.last_name}"

                    # Delete related records first (Django will handle this automatically if you've set up CASCADE)
                    # But we'll do it explicitly to be safe
                    Child.objects.filter(employment_id=member).delete()
                    Beneficiary.objects.filter(employment_id=member).delete()
                    WorkDetail.objects.filter(employment_id=member).delete()

                    # Delete the member
                    member.delete()

                    # Add to deleted list
                    deleted_members.append(member_name)

                    # Create history record
                    HistoryList.objects.create(
                        date=now,
                        staff_name=request.session["staff_name"],
                        action=f"deleted member {member_name}"
                    )

                except Members.DoesNotExist:
                    # Skip if member doesn't exist
                    continue

            return JsonResponse({
                "success": True,
                "message": f"Successfully deleted {len(deleted_members)} member(s)",
                "deleted_members": deleted_members
            })

        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)

    return JsonResponse({"success": False, "error": "Invalid request method"}, status=400)
