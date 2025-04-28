from django import forms
from .models import Members

class MemberForm(forms.ModelForm):
    class Meta:
        model = Members
        fields = ('username', 'password', 'first_name', 'last_name', 'middle_name', 'nickname', 'date_of_birth', 'age', 'civil_status', 'sex', 'spouse_name', 'phone_number', 'email_address', 'address_province', 'address_city', 'address_street', 'father_name', 'mother_name', 'has_children', 'school_name', 'degree_units', 'edu_start_date', 'edu_end_date', 'honors_received', 'office_name', 'service_record', 'pgb_id_no', 'tin_no', 'start_date', 'end_date', 'position', 'salary', 'appointment_status', 'staff_approved_by', 'res_certificate_no', 'issued_date')
def register(request):
    if request.method == 'POST':
        form = MemberForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('success')
    else:
        form = MemberForm()
    return render(request, 'ims/dashboard.html', {'form': form})