export default function Index() {
  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-3xl font-bold text-foreground mb-4">
        WorkForce Analytics Dashboard
      </h1>
      <p className="text-muted-foreground">
        AI-powered workforce insights dashboard is loading...
      </p>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Total Workers</h3>
          <p className="text-2xl font-bold">4</p>
        </div>
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Total Hours</h3>
          <p className="text-2xl font-bold">32h</p>
        </div>
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Productivity</h3>
          <p className="text-2xl font-bold">2.8</p>
        </div>
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Top Performer</h3>
          <p className="text-2xl font-bold">M. Kumar</p>
        </div>
      </div>
    </div>
  );
}
