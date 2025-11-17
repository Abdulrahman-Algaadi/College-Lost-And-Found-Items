using Lost_And_Found_Items_Api.Controllers;
using Lost_And_Found_Items_Api.Models;
using Lost_And_Found_Items_Api.Data_Access_Layer;
using Lost_And_Found_Items_Api.Data_Logic;
using Microsoft.EntityFrameworkCore;
using System;

var builder = WebApplication.CreateBuilder(args);

// ---------------------------
// Add CORS Policy
// ---------------------------
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()   // allow any origin
              .AllowAnyHeader()   // allow any header
              .AllowAnyMethod();  // allow GET, POST, PUT, DELETE, etc.
    });
});

// ---------------------------
// DB Context
// ---------------------------
builder.Services.AddDbContext<CollegeLostAndFoundContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// ---------------------------
// Repositories
// ---------------------------
builder.Services.AddScoped<ItemRepository>();
builder.Services.AddScoped<CategoryRepository>();
builder.Services.AddScoped<StatusRepository>();
builder.Services.AddScoped<AdminRepository>();

// ---------------------------
// Services
// ---------------------------
builder.Services.AddScoped<ItemService>();
builder.Services.AddScoped<CategoryService>();
builder.Services.AddScoped<StatusService>();
builder.Services.AddScoped<AdminService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ---------------------------
// Use CORS Middleware
// ---------------------------
app.UseCors("AllowAll");

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.MapControllers();

app.Run();
