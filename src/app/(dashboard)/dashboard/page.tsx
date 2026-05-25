import { Card, CardContent } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="text-gray-500">
          Welcome to Auvit Service Platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-sm text-gray-500">
              Open Tickets
            </h2>

            <p className="text-3xl font-bold mt-2">
              12
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-sm text-gray-500">
              Critical Tickets
            </h2>

            <p className="text-3xl font-bold mt-2 text-red-500">
              3
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-sm text-gray-500">
              Active Technicians
            </h2>

            <p className="text-3xl font-bold mt-2">
              8
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-sm text-gray-500">
              Pending Services
            </h2>

            <p className="text-3xl font-bold mt-2">
              5
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}