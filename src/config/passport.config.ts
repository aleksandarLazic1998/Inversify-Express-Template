import { OIDCStrategy } from "passport-azure-ad";

const PassportAzureActiveDirectoryStrategy = new OIDCStrategy(
  {
    identityMetadata:
      "https://login.microsoftonline.com/4ad82a21-02d2-4348-8d7c-0515d2aeb208/v2.0/.well-known/openid-configuration",
    clientID: "3b134cb7-f9dc-4457-ae77-dcca4a749436",
    responseType: "code id_token",
    responseMode: "form_post",
    // For local development, allow HTTP redirect URL
    redirectUrl: "http://localhost:3000/auth/openid/return",
    allowHttpForRedirectUrl: true,
    // In production, replace this with your actual client secret generated in Azure AD
    clientSecret: "2e75c340-b675-4f74-8c39-4c75f65e04cd",
    scope: ["openid", "profile", "email"],
    passReqToCallback: false, // Added to satisfy type requirements
  },
  (iss, sub, profile, accessToken, refreshToken, done) => {
    console.log(iss, sub, profile, accessToken, refreshToken);
    console.log("___________-");

    // Your verification logic here
    return done(null, profile);
  }
);

export default PassportAzureActiveDirectoryStrategy;
