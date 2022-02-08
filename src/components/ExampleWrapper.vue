<script setup lang="ts">
const isRunningOnCodeSandbox = import.meta.env.VITE_CODESANDBOX_SSE || import.meta.env.CODESANDBOX_SSE
const hasLiveblocksSecretKey= import.meta.env.VITE_hasLiveblocksSecretKey || import.meta.env.VITE_LIVEBLOCKS_PUBLIC_KEY || import.meta.env.VITE_LIVEBLOCKS_SECRET_KEY
</script>

<template>
  <slot v-if="hasLiveblocksSecretKey" />
  <div v-else>
    <div v-if="isRunningOnCodeSandbox">
      <p class="mt-12 mb-6">
        To run
        <a href="https://liveblocks.io" target="_blank" rel="noreferrer">
          Liveblocks
        </a>
        examples on CodeSandbox
      </p>
      <ul class="list-disc list-inside">
        <li class="mb-2">
          Create an account on
          <a href="https://liveblocks.io" target="_blank" rel="noreferrer">
            liveblocks.io
          </a>
        </li>
        <li class="mb-2">Copy your secret key from the administration</li>
        <li class="mb-2">
          Add a
          <a
            href="https://codesandbox.io/docs/secrets"
            target="_blank"
            rel="noreferrer"
          >
            secret key
          </a>
          named
          <pre class="relative inline-block font-mono bg-black shadow-thin-border-300 rounded-lg text-sm text-gray-200 p-2 pl-0" style="min-height: 36px; line-height: 1.5em;">
            <code>
              LIVEBLOCKS_SECRET_KEY
            </code>
          </pre>
          to your CodeSandbox sandbox.
        </li>
        <li class="mb-2">
          Refresh your browser and you should be good to go!
        </li>
      </ul>
    </div>
    <div v-else>
      <p class="mt-12 mb-6">
        To run
        <a href="https://liveblocks.io" target="_blank" rel="noreferrer">
          Liveblocks
        </a>
        examples locally
      </p>
      <ul class="list-disc list-inside">
        <li class="mb-2">
          Install all dependencies with
          <pre class="relative font-mono bg-black shadow-thin-border-300 rounded-lg my-4 text-sm text-gray-200 pt-2" style="min-height: 36px; line-height: 1.5em; max-width: 400px;">
            <code>
              npm install
            </code>
          </pre>
        </li>
        <li class="mb-2">
          Create an account on
          <a href="https://liveblocks.io" target="_blank" rel="noreferrer">
            liveblocks.io
          </a>
        </li>
        <li class="mb-2">Copy your secret key from the administration</li>
        <li class="mb-2">
          Create a file named
          <pre class="relative font-mono bg-black shadow-thin-border-300 rounded-lg my-4 text-sm text-gray-200 pt-2" style="min-height: 36px; line-height: 1.5em; max-width: 400px;">
            <code>
              .env
            </code>
          </pre>and add your
          Liveblocks secret as environment variable
          <pre class="relative font-mono bg-black shadow-thin-border-300 rounded-lg my-4 text-sm text-gray-200 pt-2" style="min-height: 36px; line-height: 1.5em; max-width: 400px;">
            <code>
              LIVEBLOCKS_SECRET_KEY=sk_test_yourkey
            </code>
          </pre>
        </li>
        <li class="mb-2">
          Run the following command and you should be good to go
           <pre class="relative font-mono bg-black shadow-thin-border-300 rounded-lg my-4 text-sm text-gray-200 pt-2" style="min-height: 36px; line-height: 1.5em; max-width: 400px;">
            <code>
              npm run dev
            </code>
          </pre>
        </li>
      </ul>
    </div>
  </div>
</template>
