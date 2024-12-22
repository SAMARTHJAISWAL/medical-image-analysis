<!-- layouts/default.vue -->
<template>
    <div class="min-h-screen bg-gray-50">
      <nav class="bg-medical-primary text-white p-4">
        <div class="container mx-auto">
          <h1 class="text-xl font-bold">Medical Image Analysis</h1>
        </div>
      </nav>
      
      <main class="container mx-auto py-6">
        <slot />
      </main>
    </div>
  </template>