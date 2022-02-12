<script setup lang="ts">
import { info } from './Example'

const currentUrl = window.location.href
const open = $ref(true)
</script>

<template>
  <div v-if="!info.hide && open" class="fixed z-50 top-4 left-4 right-4 px-6 max-w-full sm:w-96 rounded-lg font-karla text-gray-400 bg-gray-900 dark:bg-gray-100 dark:text-gray-500">
    <div class="flex justify-between pt-6 mt-0.5">
      <div>
        <h1 class="text-2xl text-white dark:text-gray-900 font-extrabold tracking-tight">{{ info.title }}</h1>
      </div>
      <button @click="open = false" class="text-gray-400 hover:text-gray-300 focus:text-gray-300 dark:text-gray-500 dark:hover:text-gray-600 dark:focus:text-gray-600 w-8 h-8 flex items-center justify-center -mr-3 rounded-full">
        <span class="sr-only">Close dialog</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M2.96967 11.9697L11.9697 2.96967L13.0303 4.03033L4.03033 13.0303L2.96967 11.9697Z"></path>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M13.0303 11.9697L4.03033 2.96967L2.96968 4.03033L11.9697 13.0303L13.0303 11.9697Z"></path>
        </svg>
      </button>
    </div>
    <p class="mt-3 leading-relaxed">{{info.description }}</p>
    <a
      :href="currentUrl"
      class="transition-colors focus:text-white text-gray-300 dark:text-gray-600 hover:text-white dark:hover:text-black font-semibold block bg-gray-700 dark:bg-gray-200 hover:bg-gray-600 dark:hover:bg-gray-300 text-center w-full mt-5 mb-4 p-2.5 rounded font-bold text-white"
      target="_blank"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="inline fill-current mr-2">
        <path d="M3.5 3.5v9h9V8H14v5a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1h5v1.5H3.5z"></path>
        <path clip-rule="evenodd" d="M11.44 3.5H10V2h4v4h-1.5V4.56L7.53 9.53 6.47 8.47l4.97-4.97z"></path>
      </svg>
      Open in new window
    </a>
    <div class="flex items-center justify-between pb-4">
      <span class="pt-1"><a :href="info.website" class="transition-colors text-white dark:text-black hover:text-white font-extrabold tracking-tight text-xl">ctnicholas.dev</a></span>
      <ul class="flex items-center -mr-2 mt-2">
        <li v-if="info.twitterHref">
          <a
            class="transition-colors hover:text-white dark:hover:text-black cursor-pointer flex items-center justify-center p-2 text-gray-400 rounded-full mr-[-1px]"
            :href="info.twitterHref"
            target="_blank"
            rel="noopener noreferrer"
            title="Open in Github"
            aria-label="Open in Github"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"
              ></path>
            </svg>
          </a>
        </li>
        <li v-if="info.githubHref">
          <a
            class="transition-colors hover:text-white dark:hover:text-black cursor-pointer flex items-center justify-center p-2 text-gray-400 rounded-full"
            :href="info.githubHref"
            target="_blank"
            rel="noopener noreferrer"
            title="Open in Github"
            aria-label="Open in Github"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10 1.66664C8.90569 1.66664 7.82206 1.88219 6.81101 2.30098C5.79997 2.71977 4.88131 3.3336 4.10749 4.10742C2.54468 5.67022 1.66671 7.78984 1.66671 9.99998C1.66671 13.6833 4.05838 16.8083 7.36671 17.9166C7.78338 17.9833 7.91671 17.725 7.91671 17.5V16.0916C5.60838 16.5916 5.11671 14.975 5.11671 14.975C4.73338 14.0083 4.19171 13.75 4.19171 13.75C3.43338 13.2333 4.25004 13.25 4.25004 13.25C5.08338 13.3083 5.52504 14.1083 5.52504 14.1083C6.25004 15.375 7.47504 15 7.95004 14.8C8.02504 14.2583 8.24171 13.8916 8.47504 13.6833C6.62504 13.475 4.68338 12.7583 4.68338 9.58331C4.68338 8.65831 5.00004 7.91664 5.54171 7.32498C5.45838 7.11664 5.16671 6.24998 5.62504 5.12498C5.62504 5.12498 6.32504 4.89998 7.91671 5.97498C8.57504 5.79164 9.29171 5.69998 10 5.69998C10.7084 5.69998 11.425 5.79164 12.0834 5.97498C13.675 4.89998 14.375 5.12498 14.375 5.12498C14.8334 6.24998 14.5417 7.11664 14.4584 7.32498C15 7.91664 15.3167 8.65831 15.3167 9.58331C15.3167 12.7666 13.3667 13.4666 11.5084 13.675C11.8084 13.9333 12.0834 14.4416 12.0834 15.2166V17.5C12.0834 17.725 12.2167 17.9916 12.6417 17.9166C15.95 16.8 18.3334 13.6833 18.3334 9.99998C18.3334 8.90563 18.1178 7.82199 17.699 6.81095C17.2803 5.7999 16.6664 4.88124 15.8926 4.10742C15.1188 3.3336 14.2001 2.71977 13.1891 2.30098C12.178 1.88219 11.0944 1.66664 10 1.66664V1.66664Z"
              ></path>
            </svg>
          </a>
        </li>
        <li v-if="info.codeSandboxHref">
          <a
            class="transition-colors hover:text-white dark:hover:text-black cursor-pointer flex items-center justify-center p-2 text-gray-400 rounded-full"
            :href="info.codeSandboxHref"
            target="_blank"
            rel="noopener noreferrer"
            title="Open in CodeSandbox"
            aria-label="Open in CodeSandbox"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M1 4L7.969 0L14.9405 4L15.0005 11.966L7.969 16L1 12V4ZM2.393 5.6535V8.8255L4.622 10.065V12.409L7.2705 13.9405V8.425L2.393 5.6535ZM13.552 5.6535L8.6745 8.4245V13.94L11.3205 12.4085V10.0675L13.5525 8.8255L13.552 5.6535ZM3.0885 4.401L7.9585 7.164L12.8385 4.3775L10.258 2.9115L7.9845 4.2085L5.698 2.896L3.0885 4.401Z"
              ></path>
            </svg>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
