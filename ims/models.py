import uuid
import random
import string
from django.contrib.auth.hashers import make_password, check_password
from django.db import models
from django.utils import timezone

def generate_employment_id():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))  # 10-character ID
def generate_staff_emp_id():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))  # 10-character ID for staff





class HistoryList(models.Model):
    date = models.DateTimeField(default=timezone.now)
    staff_name = models.CharField(max_length=150)
    action = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.date} - {self.staff_name} - {self.action}"



class GovernmentOffice(models.Model):
    office_code = models.CharField(max_length=150, unique=True)
    office_full_name = models.CharField(max_length=150, unique=True)

    def __str__(self):
        return self.office_code





class Staff(models.Model):
    id = models.AutoField(primary_key=True)
    staff_name = models.CharField(max_length=150, unique=True)
    staff_pass = models.CharField(max_length=128)  # Store hashed password
    staff_emp_id = models.CharField(max_length=10, unique=True, default=generate_staff_emp_id)
    last_login = models.DateTimeField(auto_now=True)  # Add this field

    def save(self, *args, **kwargs):
        if not self.pk or Staff.objects.get(pk=self.pk).staff_pass != self.staff_pass:
            self.staff_pass = make_password(self.staff_pass)  # Hash password before saving
        super().save(*args, **kwargs)

    def __str__(self):
        return self.staff_name


class Members(models.Model):
    member_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=150, unique=True)
    password = models.CharField(max_length=128)
    employment_id = models.CharField(max_length=10, unique=True, default=generate_employment_id)

    def save(self, *args, **kwargs):
        if not self.employment_id:
            self.employment_id = generate_employment_id()
        super().save(*args, **kwargs)

    Staff_Approved_by = models.ForeignKey(
        Staff, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name="approved_members"  # Allows fetching members via Staff model
    )

    # Personal details
    last_name = models.CharField(max_length=150, null=True, blank=True)
    first_name = models.CharField(max_length=150, null=True, blank=True)
    middle_name = models.CharField(max_length=150, null=True, blank=True)
    nickname = models.CharField(max_length=100, null=True, blank=True)

    # Address
    address_province = models.CharField(max_length=100, null=True, blank=True)
    address_city = models.CharField(max_length=100, null=True, blank=True)
    address_street = models.CharField(max_length=255, null=True, blank=True)

    # Contact Info
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    email_address = models.EmailField(null=True, blank=True)

    # Other Details
    date_of_birth = models.DateField(null=True, blank=True)
    age = models.IntegerField(null=True, blank=True)

    CIVIL_STATUS_CHOICES = [
        ('single', 'Single'),
        ('married', 'Married'),
        ('widowed', 'Widowed'),
        ('divorced', 'Divorced'),
    ]
    civil_status = models.CharField(max_length=10, choices=CIVIL_STATUS_CHOICES, default='single')

    SEX_CHOICES = [('male', 'Male'), ('female', 'Female')]
    sex = models.CharField(max_length=6, choices=SEX_CHOICES, null=True, blank=True)

    # Family Details
    spouse_name = models.CharField(max_length=150, null=True, blank=True)
    father_name = models.CharField(max_length=150, null=True, blank=True)
    mother_name = models.CharField(max_length=150, null=True, blank=True)
    has_children = models.BooleanField(default=False)
    # Education Details
    school_name = models.CharField(max_length=100, null=True, blank=True)
    degree_units = models.CharField(max_length=30, null=True, blank=True)
    edu_start_date = models.DateField(null=True, blank=True)
    edu_end_date = models.DateField(null=True, blank=True)
    honors_received = models.CharField(max_length=150, null=True, blank=True)
    
    #Approved by
    
    Res_Certificate_no = models.BigIntegerField(null=True, blank=True)
    Issued_date = models.DateField(null=True, blank=True)


    def __str__(self):
        return self.employment_id


class Child(models.Model):
    employment_id = models.ForeignKey(
        Members,
        on_delete=models.SET_NULL,  # Changed from CASCADE to prevent errors
        related_name="child_records",
        to_field="employment_id",
        null=True,
        blank=True
    )
    name = models.CharField(max_length=100)
    birth_date = models.DateField()

    def __str__(self):
        return f"{self.name} (Child of {self.employment_id})"


class Beneficiary(models.Model):
    RELATIONSHIP_CHOICES = [
        ('father', 'Father'),
        ('mother', 'Mother'),
        ('child', 'Child'),
        ('siblings', 'Siblings'),
        ('other_relative', 'Other Relative'),
    ]
    employment_id = models.ForeignKey(
        Members,
        on_delete=models.SET_NULL,
        related_name="beneficiaries",
        to_field="employment_id",
        null=True,
        blank=True
    )
    full_name = models.CharField(max_length=150, null=True, blank=True)
    age = models.IntegerField(null=True, blank=True)
    relationship = models.CharField(max_length=20, choices=RELATIONSHIP_CHOICES)

    def __str__(self):
        return f"{self.full_name} ({self.relationship})"





class WorkDetail(models.Model):
    APPOINTMENT_STATUS_CHOICES = [
        ('permanent', 'Permanent'),
        ('contractual', 'Contractual'),
        ('casual', 'Casual'),
        ('job_order', 'Job Order'),
    ]

    employment_id = models.ForeignKey(
        Members,
        on_delete=models.SET_NULL,
        related_name="work_details",
        to_field="employment_id",
        null=True,
        blank=True
    )
    office_name = models.ForeignKey(
        GovernmentOffice,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="work_details"
    )
    service_record = models.BigIntegerField(null=True, blank=True)
    pgb_id_no = models.CharField(max_length=20, null=True, blank=True)
    tin_no = models.BigIntegerField(null=True, blank=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    position = models.CharField(max_length=50, null=True, blank=True)
    salary = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    appointment_status = models.CharField(
        max_length=20, 
        choices=APPOINTMENT_STATUS_CHOICES, 
        null=True, 
        blank=True
    )

    def __str__(self):
        return f"{self.position} at {self.office_name.office_code if self.office_name else 'No Office'}"