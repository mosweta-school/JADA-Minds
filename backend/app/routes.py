# backend/app/routes.py - Complete fixed version

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app import auth

api_bp = Blueprint('api', __name__, url_prefix='/api')


def get_user_id():
    """Helper to get user_id from JWT identity and convert to int."""
    try:
        user_id = get_jwt_identity()
        if user_id is None:
            return None
        if isinstance(user_id, str):
            return int(user_id)
        return user_id
    except (ValueError, TypeError) as e:
        return None


def get_json_data():
    """Helper to get JSON data from request."""
    try:
        data = request.get_json(silent=True)
        if data is None:
            data = request.json
        return data
    except Exception:
        return None

# ============================================================================
# AUTHENTICATION ROUTES
# ============================================================================

@api_bp.route('/auth/register', methods=['POST'])
def register():
    """Register a new user."""
    data = get_json_data()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400
    
    required = ['full_name', 'email', 'password', 'confirm_password']
    for field in required:
        if field not in data:
            return jsonify({"error": f"{field} is required."}), 400
    
    if data['password'] != data['confirm_password']:
        return jsonify({"error": "Passwords do not match."}), 400
    
    result, status = auth.register_user(
        full_name=data['full_name'],
        email=data['email'],
        password=data['password'],
        phone=data.get('phone'),
        role=data.get('role', 'client')
    )
    return jsonify(result), status

@api_bp.route('/auth/google', methods=['POST'])
def google_login():
    """Authenticate user with Google OAuth."""
    data = get_json_data()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400
    
    credential = data.get('credential')
    if not credential:
        return jsonify({"error": "Missing credential"}), 400
    
    result, status = auth.google_login(credential)
    return jsonify(result), status


@api_bp.route('/auth/login', methods=['POST'])
def login():
    """Login a user."""
    data = get_json_data()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400
    
    if 'email' not in data or 'password' not in data:
        return jsonify({"error": "Email and password are required."}), 400
    
    result, status = auth.login_user(data['email'], data['password'])
    return jsonify(result), status


@api_bp.route('/auth/verify-email', methods=['POST'])
def verify_email():
    """Verify user's email address."""
    data = get_json_data()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400
    
    if 'token' not in data:
        return jsonify({"error": "Token is required."}), 400
    
    result, status = auth.verify_email(data['token'])
    return jsonify(result), status


@api_bp.route('/auth/forgot-password', methods=['POST'])
def forgot_password():
    """Initiate password reset."""
    data = get_json_data()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400
    
    if 'email' not in data:
        return jsonify({"error": "Email is required."}), 400
    
    result, status = auth.forgot_password(data['email'])
    return jsonify(result), status


@api_bp.route('/auth/reset-password', methods=['POST'])
def reset_password():
    """Reset password using token."""
    data = get_json_data()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400
    
    #  Accept both 'new_password' and 'newPassword' for flexibility
    token = data.get('token')
    new_password = data.get('new_password') or data.get('newPassword')
    
    if not token:
        return jsonify({"error": "Token is required."}), 400
    
    if not new_password:
        return jsonify({"error": "New password is required."}), 400
    
    result, status = auth.reset_password(token, new_password)
    return jsonify(result), status


@api_bp.route('/auth/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token."""
    user_id = get_user_id()
    if user_id is None:
        return jsonify({"error": "Invalid user ID"}), 400
    
    result, status = auth.refresh_access_token(user_id)
    return jsonify(result), status


@api_bp.route('/auth/logout', methods=['POST'])
@jwt_required()
def logout():
    """Logout user."""
    jti = get_jwt()['jti']
    user_id = get_user_id()
    if user_id is None:
        return jsonify({"error": "Invalid user ID"}), 400
    
    result, status = auth.logout_user(jti, user_id)
    return jsonify(result), status


@api_bp.route('/auth/mfa/verify', methods=['POST'])
@jwt_required()
def verify_mfa():
    """Verify MFA code during login."""
    data = get_json_data()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400
    
    if 'code' not in data:
        return jsonify({"error": "MFA code is required."}), 400
    
    claims = get_jwt()
    if not claims.get('mfa_pending', False):
        return jsonify({"error": "MFA not required for this session."}), 400
    
    user_id = get_user_id()
    if user_id is None:
        return jsonify({"error": "Invalid user ID"}), 400
    
    result, status = auth.verify_mfa_login(user_id, data['code'])
    return jsonify(result), status


# ============================================================================
# PROFILE ROUTES
# ============================================================================

@api_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get user profile."""
    user_id = get_user_id()
    if user_id is None:
        return jsonify({"error": "Invalid user ID"}), 400
    
    result, status = auth.get_user_profile(user_id)
    return jsonify(result), status


@api_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update user profile."""
    user_id = get_user_id()
    if user_id is None:
        return jsonify({"error": "Invalid user ID"}), 400
    
    data = get_json_data()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400
    
    result, status = auth.update_user_profile(user_id, data)
    return jsonify(result), status


@api_bp.route('/profile/change-password', methods=['POST'])
@jwt_required()
def change_password():
    """Change user password."""
    user_id = get_user_id()
    if user_id is None:
        return jsonify({"error": "Invalid user ID"}), 400
    
    data = get_json_data()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400
    
    required = ['current_password', 'new_password', 'confirm_password']
    for field in required:
        if field not in data:
            return jsonify({"error": f"{field} is required."}), 400
    
    if data['new_password'] != data['confirm_password']:
        return jsonify({"error": "Passwords do not match."}), 400
    
    result, status = auth.change_password(
        user_id,
        data['current_password'],
        data['new_password']
    )
    return jsonify(result), status


# ============================================================================
# MFA MANAGEMENT ROUTES
# ============================================================================

@api_bp.route('/profile/mfa/enable', methods=['POST'])
@jwt_required()
def enable_mfa():
    """Enable MFA for user."""
    user_id = get_user_id()
    if user_id is None:
        return jsonify({"error": "Invalid user ID"}), 400
    
    result, status = auth.enable_mfa(user_id)
    return jsonify(result), status


@api_bp.route('/profile/mfa/verify', methods=['POST'])
@jwt_required()
def verify_mfa_setup():
    """Verify MFA setup and enable."""
    user_id = get_user_id()
    if user_id is None:
        return jsonify({"error": "Invalid user ID"}), 400
    
    data = get_json_data()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400
    
    if 'code' not in data:
        return jsonify({"error": "MFA code is required."}), 400
    
    result, status = auth.verify_mfa_setup(user_id, data['code'])
    return jsonify(result), status


@api_bp.route('/profile/mfa/disable', methods=['POST'])
@jwt_required()
def disable_mfa():
    """Disable MFA for user."""
    user_id = get_user_id()
    if user_id is None:
        return jsonify({"error": "Invalid user ID"}), 400
    
    result, status = auth.disable_mfa(user_id)
    return jsonify(result), status


# ============================================================================
# HEALTH CHECK
# ============================================================================

@api_bp.route('/health', methods=['GET'])
def health():
    """Health check endpoint."""
    return jsonify({
        "status": "healthy",
        "service": "JADA Minds API",
        "version": "1.0.0"
    }), 200