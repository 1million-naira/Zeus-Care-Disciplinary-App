// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { createClient } from 'jsr:@supabase/supabase-js@2'

const supURL = Deno.env.get("_SUPABASE_URL") as string;
const supKey = Deno.env.get("_SUPABASE_SERVICE_KEY") as string;

const supabase = createClient(supURL, supKey)

const cqcKey = Deno.env.get("_CQC_API_KEY") as string;
const chKey = Deno.env.get("_CH_API_KEY") as string;

const handleApiResponse = (response: Response, context: string = "request") => {
  const code = response.status;

  if (response.ok) return; // everything is fine

  // user-friendly messages based on status
  switch (code) {
    case 404:
      return {message: `We couldn't find any results for your ${context}. Please check and try again.`}
    case 401:
      return {message: "We're unable to verify this company right now. Please try again shortly."};
    case 429:
      return {message: "Too many requests. Verification is temporarily unavailable."};
    case 500:
    case 502:
    case 503:
    case 504:
      return {message: "The verification service is currently unavailable. Please try again later."};
    default:
      return {message: "We couldn't complete the verification. Please try again."};
  }
}


const cqcHandler = async (cqcId : string) => {
  const cqcVerifyURL = `https://api.service.cqc.org.uk/public/v1/providers/${cqcId}`
  const cqcResponse = await fetch(cqcVerifyURL, {
    method: 'GET',
    headers: {
      'Ocp-Apim-Subscription-Key' : cqcKey
    }
  })

  const responseError = handleApiResponse(cqcResponse, 'CQC ID')
  if(responseError){
    return new Response(JSON.stringify({error: responseError.message}), {
      headers: {'Content-Type': 'application/json'},
      status: 200,
    })
  }

  const cqcData = await cqcResponse.json();
  return new Response(JSON.stringify({
    name: cqcData.name,
    type: cqcData.type,
    reg_date: cqcData.registrationDate,
    address: {
      address_line_1: cqcData.postalAddressLine1,
      address_line_2: cqcData.postalAddressLine2,
      city: cqcData.postalAddressTownCity,
      post_code: cqcData.postalCode,
      country: null,
      region: cqcData.region
    },
    cqcNum: cqcData.providerId,
    company_number: cqcData.companiesHouseNumber,
    company_source: 'cqc'
  }), {
    headers: {'Content-Type': 'application/json'},
    status: 200,
  })
  // return {
  //   name: cqcData.name,
  //   type: cqcData.type,
  //   reg_date: cqcData.registrationDate,
  //   address: {
  //     address_line_1: cqcData.postalAddressLine1,
  //     address_line_2: cqcData.postalAddressLine2,
  //     city: cqcData.postalAddressTownCity,
  //     post_code: cqcData.postalCode,
  //     country: null,
  //     region: cqcData.region
  //   },
  //   cqcNum: cqcData.providerId,
  //   company_number: cqcData.companiesHouseNumber,
  //   company_source: 'cqc'
  // };
}


const chHandler = async (chId : string) => {
  const chVerifyURL = `https://api.company-information.service.gov.uk/company/${chId}`
  const chResponse = await fetch(chVerifyURL, {
    method: 'GET',
    headers: {
      'Authorization' : 'Basic ' + btoa(chKey + ':')
    }
  })

  const responseEerror = handleApiResponse(chResponse, 'Companies House Number')
  if(responseEerror){
    return new Response(JSON.stringify({error: responseEerror.message}), {
      headers: {'Content-Type': 'application/json'},
      status: 200,
    })
  }

  const chData = await chResponse.json();
  return new Response(JSON.stringify({
    name: chData.company_name,
    reg_date: chData.date_of_creation,
    type: null,
    company_number: chData.company_number,
    address: {
      address_line_1: chData.registered_office_address.address_line_1,
      address_line_2: chData.registered_office_address.address_line_2,
      city: chData.registered_office_address.locality,
      country: chData.registered_office_address.country,
      region: null,
      post_code: chData.registered_office_address.postal_code,
    },
    company_source: 'comapnies_house'
  }), {
      headers: {'Content-Type': 'application/json'},
      status: 200, 
  }

  )
  // return {
  //   name: chData.company_name,
  //   reg_date: chData.date_of_creation,
  //   type: null,
  //   company_number: chData.company_number,
  //   address: {
  //     address_line_1: chData.registered_office_address.address_line_1,
  //     address_line_2: chData.registered_office_address.address_line_2,
  //     city: chData.registered_office_address.locality,
  //     country: chData.registered_office_address.country,
  //     region: null,
  //     post_code: chData.registered_office_address.postal_code,
  //   },
  //   company_source: 'comapnies_house'
  // };
}

console.log("Hello from Functions!")

// const cqcVerifyURL = `https://api.service.cqc.org.uk/public/v1/providers/${}`
// const chVerifyURL = `https://api.company-information.service.gov.uk/company/${}`


Deno.serve(async (req) => {
  let result = undefined;

  try{
    const reqBody = await req.json()
    console.log(reqBody)

    
    if(reqBody.companiesHouse){
      result = await chHandler(reqBody.id)
    } else{
      result = await cqcHandler(reqBody.id)
    }

    return result;

  // return new Response(
  //   JSON.stringify({result}),
  //   { 
  //     headers: { "Content-Type": "application/json" },
  //     status: 200
  //   },
  // )

  } catch (error){
    if(error instanceof Error){
      const message = error.message
      console.log('Function error: ', error)
      result = {error : message}
    }
    return new Response(JSON.stringify({result}),
    {
      headers: {'Content-Type': 'application/json'},
      status: 500,
    }
    )
  }
  // const data = {
  //   message: `Hello ${reqBody.serviceName}!`,
  // }

})


/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/register-company' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/



