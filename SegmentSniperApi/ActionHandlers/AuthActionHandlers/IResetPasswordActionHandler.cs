﻿namespace SegmentSniper.Api.ActionHandlers.AuthActionHandlers
{
    public interface IResetPasswordActionHandler
    {
        Task<PasswordResetRequest.Response> HandleAsync(PasswordResetRequest request);
    }

    public class PasswordResetRequest
    {
        public PasswordResetRequest(string userId, string passwordResetToken, string newPassword)
        {
            UserId = userId;
            PasswordResetToken = passwordResetToken;
            NewPassword = newPassword;
        }

        public string UserId { get; set; }
        public string PasswordResetToken { get; }
        public string NewPassword { get; }
        public class Response
        {
            public Response(bool success)
            {
                Success = success;
            }

            public bool Success { get; }
        }
    }
}