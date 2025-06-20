import { DatabaseStatus } from "@/components/auth/database-status"

export default function SetupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Smart School Scheduler Setup</h1>
          <p className="mt-2 text-gray-600">Let's make sure your database is properly configured</p>
        </div>

        <DatabaseStatus />

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Setup Instructions</h2>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-medium">1. Database Setup</h3>
              <p className="text-gray-600">Run the SQL scripts in your Supabase dashboard:</p>
              <ul className="list-disc list-inside ml-4 text-gray-600">
                <li>scripts/setup-auth-tables.sql</li>
                <li>scripts/seed-demo-users.sql (optional)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium">2. Environment Variables</h3>
              <p className="text-gray-600">Make sure these are set:</p>
              <ul className="list-disc list-inside ml-4 text-gray-600">
                <li>NEXT_PUBLIC_SUPABASE_URL</li>
                <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
