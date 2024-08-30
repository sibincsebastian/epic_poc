

async function getAccessToken() {
    const authorizationCode =
      "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ1cm46b2lkOmZoaXIiLCJjbGllbnRfaWQiOiJiYzBiMDc4Ny02NjVlLTQ0ODQtOTdhMi1jOWFkMDcwNDQzODIiLCJlcGljLmVjaSI6InVybjplcGljOk9wZW4uRXBpYy1jdXJyZW50IiwiZXBpYy5tZXRhZGF0YSI6IlY5YjhEX1pLWHFXeGVKcTNySEthdDZpeWZHWEtrcmZIei1Sc1g1VTBQNWNMNUxWV3RnRjh1Y2xLU2pId0xaRmwzU1lPblZwQmNpVEhfZ2I3ZnI3YnJmZ2VBVS1PNFhwZXdqQlFITHhjSjF0QXd0NWdCWDlkYTUxT2R3Ry1sZEw5IiwiZXBpYy50b2tlbnR5cGUiOiJjb2RlIiwiZXhwIjoxNzIyNjAyMTg4LCJpYXQiOjE3MjI2MDE4ODgsImlzcyI6InVybjpvaWQ6ZmhpciIsImp0aSI6IjJjYjI4MDc0LTNlNWQtNDUxMy1hZjk4LTMwOTM3MzdiOWJjYyIsIm5iZiI6MTcyMjYwMTg4OCwic3ViIjoiZTNNQlhDT21jb0xLbDdheUxENTFBV0EzIn0.q9zue8q1LfdVbPHBAWpeMJZNV1qi2Fb3zDDRw1CQ55oeEItZQse7wXUmVkfZYxS1B9tlP_XeSU-jkRUXQs6AjLm0CvQakjz1FZrT_tLOMepqIGwQIEei1Ro9-iAnD1I8NhIPRJAxRuh63Kg6_P0MxFv7GqeUSHtCpD2fnPW1M-65yG2Wr1ixrdh-gM_P_CaYxfodW-2F28PR22AzCGqDvsJYaw0wV6YI8PUyOWvNhgtK-WCC5nl-oRtjW_NR2WQfISjfu1XeKH_e3j71-Ico8tvRqW5N-gaTKjjkHFQMFwrp9JgxBsdK-LGkDouPyNY6PcNyCL8_IPvSlGbliC8h5Q";
    const tokenEndpoint =
      "https://fhir.epic.com/interconnect-fhir-oauth/oauth2/token";
    const clientId = "bc0b0787-665e-4484-97a2-c9ad07044382";
    const clientSecret =
      "BUEzTpp1tU1BEyO82ojYAw3jNSznR2Zgur9goDtLZs25tQRwu+c0ctYhg6jLfZdNCyZSLJyH4rmOM9Az2vCRkA==";
    const redirectUri = "https://localhost:3000/callback";
  

  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: authorizationCode,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!response.ok) {
    throw new Error("Token request failed");
  }

  const data = await response.json();
  const accessToken = data.access_token;
  console.log(accessToken);
  return data.access_token;
}

getAccessToken(
  
);
