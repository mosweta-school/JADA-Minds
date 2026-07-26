from marshmallow import Schema, fields, validate


class SpecialistSchema(Schema):
    """
    Public-facing specialist profile. Deliberately excludes
    national_id_url / degree_certificate_url / professional_license_url —
    those are private verification documents, not for a client-facing
    directory. Also excludes verification_status itself, since this
    endpoint only ever returns approved specialists anyway.
    """
    id = fields.Int(dump_only=True)
    specialization = fields.Str(dump_only=True)
    bio = fields.Str(dump_only=True)
    full_name = fields.Method("get_full_name", dump_only=True)

    def get_full_name(self, obj):
        return obj.user.full_name if obj.user else None


 
class SpecialistApplicationInputSchema(Schema):
    specialization = fields.Str(required=True, validate=validate.Length(min=1))
    bio = fields.Str(required=False, allow_none=True)
    registration_number = fields.Str(required=True, validate=validate.Length(min=1))
    national_id_url = fields.Str(required=True, validate=validate.URL())
    degree_certificate_url = fields.Str(required=True, validate=validate.URL())
    professional_license_url = fields.Str(required=True, validate=validate.URL())
 
 
class SpecialistProfileUpdateSchema(Schema):
    specialization = fields.Str(validate=validate.Length(min=1))
    bio = fields.Str(allow_none=True)
 
 
class SpecialistOwnProfileSchema(Schema):
    """
    Full view of the specialist's own application. Unlike the public
    SpecialistSchema, this includes verification_status and document
    URLs, since it's their own data rather than a directory listing.
    """
    id = fields.Int(dump_only=True)
    specialization = fields.Str(dump_only=True)
    bio = fields.Str(dump_only=True)
    registration_number = fields.Str(dump_only=True)
    national_id_url = fields.Str(dump_only=True)
    degree_certificate_url = fields.Str(dump_only=True)
    professional_license_url = fields.Str(dump_only=True)
    verification_status = fields.Str(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
 

specialist_schema = SpecialistSchema()
specialists_schema = SpecialistSchema(many=True)
specialist_application_input_schema = SpecialistApplicationInputSchema()
specialist_profile_update_schema = SpecialistProfileUpdateSchema(partial=True)
specialist_own_profile_schema = SpecialistOwnProfileSchema()