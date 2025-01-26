import { RegistrationData, ApiResponse, Env } from "./types";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

class ValidationError extends Error {
  constructor(public errors: string[]) {
    super("Validation failed");
    this.name = "ValidationError";
  }
}

async function handleOptions(request: Request): Promise<Response> {
  return new Response(null, {
    headers: corsHeaders,
  });
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

async function validateFormData(formData: RegistrationData): Promise<string[]> {
  const errors: string[] = [];

  if (!formData.fullName || formData.fullName.length < 2) {
    errors.push("Full name is required and must be at least 2 characters");
  }

  if (!formData.email || !validateEmail(formData.email)) {
    errors.push("Valid email address is required");
  }

  if (!formData.semester || !formData.semester.match(/^s[1-8]$/)) {
    errors.push("Valid semester (s1-s8) is required");
  }

  if (!formData.branch || formData.branch.length < 2) {
    errors.push("Branch is required");
  }

  if (!formData.college || formData.college.length < 2) {
    errors.push("College name is required");
  }

  if (!formData.phone_number || formData.phone_number.length < 10) {
    errors.push("Valid phone number is required");
  }

  return errors;
}

async function checkExistingRegistration(
  env: Env,
  phone: string,
  email: string
): Promise<boolean> {
  const { DB } = env;
  const result = await DB.prepare(
    "SELECT phone_number FROM registrations WHERE phone_number = ? OR email = ?"
  )
    .bind(phone, email)
    .first();

  return result !== null;
}

async function sendFallback(data: unknown) {
  fetch(
    "https://discord.com/api/webhooks/1333117010699091979/kFlTdcb4SkaP_T04FxfTENaNY-C5XEXDEAakqrqg5S--gOTUYQE7NBcVQmoRkBQQ4rh7",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: JSON.stringify(data) }),
    }
  );
}

async function createRegistration(
  env: Env,
  formData: RegistrationData
): Promise<string> {
  const { DB } = env;
  console.log("Creating registration:", formData);
  sendFallback(formData);

  const id = crypto.randomUUID();
  const stmt = DB.prepare(
    `
    INSERT INTO registrations (full_name, email, semester, branch, college, id, phone_number, registration_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `
  ).bind(
    formData.fullName,
    formData.email,
    formData.semester,
    formData.branch,
    formData.college,
    id,
    formData.phone_number
  );

  try {
    await stmt.run();
    return id;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to create registration");
  }
}

async function handleRegistration(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    const formData = (await request.json()) as RegistrationData;

    // Validate form data
    const validationErrors = await validateFormData(formData);
    if (validationErrors.length > 0) {
      throw new ValidationError(validationErrors);
    }

    // Check for existing registration
    const exists = await checkExistingRegistration(
      env,
      formData.phone_number,
      formData.email
    );
    if (exists) {
      return new Response(
        JSON.stringify({
          success: false,
          errors: ["Registration already exists with this email or phone"],
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Create new registration
    const data = await createRegistration(env, formData);

    const response: ApiResponse = {
      success: true,
      message: "Registration successful",
      id: data,
    };

    return new Response(JSON.stringify(response), {
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    let status = 500;
    const response: ApiResponse = {
      success: false,
      errors: ["An error occurred during registration. Please try again."],
    };

    if (error instanceof ValidationError) {
      status = 400;
      response.errors = error.errors;
    }

    return new Response(JSON.stringify(response), {
      status,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  }
}

function convertToCSV(data: RegistrationData[]): string {
  // Define CSV headers
  const headers = [
    "ID",
    "Full Name",
    "Email",
    "Semester",
    "Phone Number",
    "Branch",
    "College",
    "Registration Date",
  ];

  // Convert data to CSV rows
  const rows = data.map((record) =>
    [
      record.id,
      record.full_name,
      record.email,
      record.semester,
      record.phone_number,
      record.branch,
      record.college,
    ].map((field) => {
      // Handle fields that might contain commas or quotes
      const stringField = String(field ?? "");
      if (
        stringField.includes(",") ||
        stringField.includes('"') ||
        stringField.includes("\n")
      ) {
        return `"${stringField.replace(/"/g, '""')}"`;
      }
      return stringField;
    })
  );

  // Combine headers and rows
  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
}

async function handleExportRegistrations(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    const { DB } = env;
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";

    // Build query based on filters
    let query = `
      SELECT 
        id,
        full_name,
        email,
        phone_number,
        semester,
        branch,
        college,
        registration_date
      FROM registrations
      WHERE 1=1
    `;

    const params: any[] = [];

    if (search) {
      query += ` AND (
        full_name LIKE ? OR 
        email LIKE ? OR 
        college LIKE ? OR 
        branch LIKE ?
      )`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY registration_date DESC`;

    // Fetch all records
    const result = await DB.prepare(query)
      .bind(...params)
      .all();
    const registrations = result.results as RegistrationData[];

    // Convert to CSV
    const csv = convertToCSV(registrations);

    // Generate filename with current date
    const date = new Date().toISOString().split("T")[0];
    const filename = `registrations_${date}.csv`;

    // Return CSV file
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to export registrations",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

async function handleCardRequest(
  request: Request,
  env: Env,
  id: string | null
): Promise<Response> {
  if (!id) {
    return new Response(
      JSON.stringify({
        success: false,
        errors: ["Card ID is required"],
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }

  const { DB } = env;
  const result = await DB.prepare(`SELECT * FROM registrations WHERE id = ?`)
    .bind(id)
    .first();

  if (!result) {
    return new Response(
      JSON.stringify({
        success: false,
        errors: ["Card not found"],
      }),
      {
        status: 404,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }

  const cardData = {
    fullName: result.full_name,
    email: result.email,
    semester: result.semester,
    branch: result.branch,
    college: result.college,
    phone_number: result.phone_number,
    registration_date: result.registration_date,
  };

  return new Response(JSON.stringify(cardData), {
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
    },
  });
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    if (request.method === "OPTIONS") {
      return handleOptions(request);
    }

    const url = new URL(request.url);
    const path = url.pathname;

    if (path === "/card" && request.method === "GET") {
      const id = url.searchParams.get("id");
      return handleCardRequest(request, env, id);
    } else if (path === "/admin/export" && request.method === "GET") {
      return handleExportRegistrations(request, env);
    } else if (path === "/" && request.method === "POST") {
      return handleRegistration(request, env);
    } else {
      const response: ApiResponse = {
        success: false,
        errors: ["Method not allowed"],
      };

      return new Response(JSON.stringify(response), {
        status: 405,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }
  },
};
