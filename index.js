
const options = {
  method: "POST",
  url: "https://cpaas.messagecentral.com/verification/v3/send?countryCode=91&customerId=C-905D466E6DC04D7&senderId=UTOMOB&type=SMS&flowType=SMS&mobileNumber=9072767620&message=Welcome to Message Central. We are delighted to have you here! - Powered by U2opia",
  headers: {
    authToken:`eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDLTkwNUQ0NjZFNkRDMDRENyIsImlhdCI6MTczNzg2ODc0OCwiZXhwIjoxODk1NTQ4NzQ4fQ.XRTPrYmejMuUj3E2YWgeLkfVlfgdA2020B_TNX3Z8ti0PBlok_Hm0jR0VyN-SFz8f0J7S9n2ehN6iSvLBGu9Cw`,
  },
};


fetch(options.url, options).then((response) => {
    console.log(response);
    response.json().then(console.log);
}).catch((error) => {
    console.log(error);
});

