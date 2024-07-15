// Import the CORS middleware
using Microsoft.AspNetCore.Cors;

// Create a new web application builder
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Add support for controllers
builder.Services.AddControllers();
// Add HTTP client factory for creating HttpClient instances
builder.Services.AddHttpClient();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Vite default port
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Build the application
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    // Use developer exception page for detailed error information during development
    app.UseDeveloperExceptionPage();
}

// Redirect HTTP requests to HTTPS
app.UseHttpsRedirection();
// Enable routing
app.UseRouting();

// Use CORS with the "ReactApp" policy
app.UseCors("ReactApp");

// Enable authorization
app.UseAuthorization();

// Map controller routes
app.MapControllers();

// Run the application
app.Run();