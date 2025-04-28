from django.contrib import admin
from django import forms
from .models import Members, Child, Beneficiary, WorkDetail, GovernmentOffice, Staff, HistoryList


class ChildInline(admin.TabularInline):
    model = Child
    extra = 1
    can_delete = True

class BeneficiaryInline(admin.TabularInline):
    model = Beneficiary
    extra = 1
    can_delete = True

class WorkDetailInline(admin.StackedInline):  # Change from TabularInline to StackedInline
    model = WorkDetail
    can_delete = True  # Ensure delete option appears
    extra = 1
    max_num = 10
    fieldsets = (  
        ("Work Details", {
            "fields": (
                ('office_name',),
                ('service_record',),
                ('pgb_id_no',),
                ('tin_no',),
                ('start_date', 'end_date'),
                ('position',),
                ('salary', 'appointment_status'),
            ),
        }),
    )

class ApprovedByInline(admin.StackedInline):
    model = Members
    fields = (  
        ("Work Details", {
            "fields": (
                ( ('Staff_Approved_by',),('Res_Certificate_no',), ('Issued_date',))
            ),
        }),
    )
    extra = 0

    
class HistoryListAdmin(admin.ModelAdmin):
    list_display = ('date', 'staff_name', 'action')
    list_filter = ('date', 'staff_name')
    search_fields = ('staff_name', 'action')

admin.site.register(HistoryList, HistoryListAdmin)
    
    




class UserAdminForm(forms.ModelForm):
    class Meta:
        model = Members
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        #self.fields['username'].disabled = True
        #self.fields['password'].disabled = True
        self.fields['employment_id'].disabled = True
        self.fields['civil_status'].widget = forms.RadioSelect(choices=Members.CIVIL_STATUS_CHOICES)
        self.fields['civil_status'].initial = 'single'
        self.fields['Staff_Approved_by'].queryset = Staff.objects.all()
        self.fields['Staff_Approved_by'].empty_label = "No staff selected"  # Default empty selection
@admin.register(Members)
class UserAdmin(admin.ModelAdmin):
    form = UserAdminForm
    list_display = ('member_id', 'employment_id',  'username', 'age', 'civil_status', 'has_children')  # Added 'staff'
    list_filter = ('civil_status', 'has_children')
    search_fields = ('username', 'first_name', 'last_name', 'employment_id')  # Allow searching by staff name

    fieldsets = (
        ("Account Details", {"fields": (('employment_id','username', ),)}),
        ("Personal Information", {"fields": (
            ('last_name', 'first_name', 'middle_name', 'nickname'),
            ('date_of_birth', 'age', 'civil_status', 'sex'),
            ('spouse_name',),
        )}),
        ("Contact Information", {"fields": (('phone_number', 'email_address'),)}),
        ("Address", {"fields": (('address_province', 'address_city', 'address_street'),)}),
        ("Family Information", {"fields": (
            ('father_name', 'mother_name'),
            ('has_children',),
        )}),
        ("Education Details", {
            "fields": (
                ('school_name', 'degree_units'),  
                ('edu_start_date', 'edu_end_date'),  
                ('honors_received',),  
            ),
        }),
        ("Approved by", {
            "fields": (
                ('Staff_Approved_by',), 
                ('Res_Certificate_no',),  
                ('Issued_date',),  
                 
            ),
        }),
    )

    inlines = [ChildInline, BeneficiaryInline, WorkDetailInline]

    class Media:
        js = ('ims/admin_script.js',)








@admin.register(GovernmentOffice)
class GovernmentOfficeAdmin(admin.ModelAdmin):
    list_display = ('id', 'office_code', 'office_full_name')  # Columns in admin list view
    search_fields = ('office_code', 'office_full_name')  # Search bar for these fields
    list_filter = ('office_code',)  # Filter option on the side panel









@admin.register(Child)
class ChildAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'birth_date', 'employment_id')

@admin.register(Beneficiary)
class BeneficiaryAdmin(admin.ModelAdmin):
    list_display = ('id', 'full_name', 'age', 'relationship', 'employment_id')



@admin.register(WorkDetail)
class WorkDetailAdmin(admin.ModelAdmin):
    list_display = ('id', 'office_name', 'position', 'start_date', 'end_date', 'salary', 'employment_id')

    fieldsets = (
        ("Work", {
            "fields": (
                ('office_name',),  # Single field on a line
                ('service_record',),  # Single field on a line
                ('pgb_id_no',),  # Single field on a line
                ('tin_no',),  # Next line
                ('start_date', 'end_date'),  # Same line
                ('position',),  # Next line
                ('salary', 'appointment_status'),  # Next line
            ),
        }),
    )

class ApprovedMembersInline(admin.TabularInline):
    model = Members
    fields = ('username', 'employment_id', 'civil_status', 'age')  # Adjust fields as needed
    readonly_fields = ('username', 'employment_id', 'civil_status', 'age')  # Make it read-only
    extra = 0  # No empty rows
    verbose_name_plural = "Approved Members"  # Set the title

@admin.register(Staff)
class StaffAdmin(admin.ModelAdmin):
    list_display = ('id', 'staff_name', 'staff_emp_id', 'approved_members_list')
    search_fields = ('staff_name', 'staff_emp_id')

    fieldsets = (
        ("Staff", {
            "fields": (
                ('staff_name',),  
                ('staff_pass',),  
                ('staff_emp_id',),  
            ),
        }),
    )

    inlines = [ApprovedMembersInline]  # Add the inline to show members who selected this staff

    def approved_members_list(self, obj):
        members = obj.approved_members.all()  # Fetch members using related_name
        return ", ".join([member.username for member in members]) if members.exists() else "None"

    approved_members_list.short_description = "Approved Members"
