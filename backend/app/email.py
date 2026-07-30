"""
Email service for JADA Minds.
Simple functions, no complex abstractions.
"""

from flask import current_app
from flask_mail import Message
from app.extensions import mail


def send_email(to_email, subject, html_content, text_content=None):
    """
    Send an email using Flask-Mail.
    
    Returns:
        bool: True if sent successfully, False otherwise
    """
    try:
        msg = Message(
            subject=subject,
            recipients=[to_email],
            html=html_content,
            sender=current_app.config.get('MAIL_DEFAULT_SENDER', 'noreply@jadaminds.com')
        )
        if text_content:
            msg.body = text_content
        mail.send(msg)
        return True
    except Exception as e:
        current_app.logger.error(f"Failed to send email to {to_email}: {e}")
        return False


def send_verification_email(email, token):
    """Send email verification email."""
    try:
        frontend_url = current_app.config.get('FRONTEND_URL', 'http://localhost:5173')
        verify_url = f"{frontend_url}/verify-email?token={token}"
        
        subject = "Verify Your Email - JADA Minds"
        html = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #6b46c1;">Welcome to JADA Minds!</h2>
            <p>Thank you for registering. Please verify your email address to get started.</p>
            <p style="text-align: center; margin: 30px 0;">
                <a href="{verify_url}" style="background-color: #6b46c1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                    Verify Email Address
                </a>
            </p>
            <p>This link expires in 24 hours.</p>
            <p style="color: #666; font-size: 14px;">If you didn't create an account, please ignore this email.</p>
        </div>
        """
        return send_email(email, subject, html)
    except Exception as e:
        current_app.logger.error(f"Failed to send verification email: {e}")
        return False


def send_welcome_email(email, full_name):
    """Send welcome email."""
    subject = "Welcome to JADA Minds!"
    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6b46c1;">Welcome to JADA Minds, {full_name}! </h2>
        <p>We're excited to have you join our community.</p>
        <p>Here's what you can do next:</p>
        <ul>
            <li> Take a wellness assessment</li>
            <li> Explore educational resources</li>
            <li> Connect with specialists</li>
            <li> Join wellness workshops</li>
        </ul>
        <p style="text-align: center; margin: 20px 0;">
            <a href="{current_app.config.get('FRONTEND_URL', 'http://localhost:5173')}/dashboard" 
               style="background-color: #6b46c1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                Go to Dashboard
            </a>
        </p>
        <p>If you have any questions, feel free to reach out.</p>
    </div>
    """
    return send_email(email, subject, html)


def send_password_reset_email(email, token):
    """Send password reset email."""
    frontend_url = current_app.config.get('FRONTEND_URL', 'http://localhost:5173')
    reset_url = f"{frontend_url}/reset-password?token={token}"
    
    subject = "Reset Your Password - JADA Minds"
    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6b46c1;">Reset Your Password</h2>
        <p>We received a request to reset your password. Click the link below to create a new password.</p>
        <p style="text-align: center; margin: 30px 0;">
            <a href="{reset_url}" style="background-color: #6b46c1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                Reset Password
            </a>
        </p>
        <p>This link expires in 30 minutes.</p>
        <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email.</p>
    </div>
    """
    return send_email(email, subject, html)


def send_mfa_email(email, code):
    """Send MFA verification code."""
    subject = "Your JADA Minds Verification Code"
    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6b46c1;">Verification Code</h2>
        <p>Enter the following code to complete your action:</p>
        <div style="text-align: center; font-size: 36px; letter-spacing: 8px; padding: 20px; background: #f5f5f5; border-radius: 8px; margin: 20px 0;">
            <strong>{code}</strong>
        </div>
        <p>This code expires in 10 minutes.</p>
        <p style="color: #666; font-size: 14px;">Never share this code with anyone.</p>
    </div>
    """
    return send_email(email, subject, html)