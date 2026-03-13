/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  // ตั้งค่านี้เป็น true เพื่อบอก ESLint ว่านี่คือ root directory ของโปรเจกต์
  // และไม่ต้องค้นหาไฟล์คอนฟิกในไดเรกทอรีที่สูงขึ้นไปอีก
  root: true,

  // ระบุสภาพแวดล้อม (environment) ที่โค้ดจะรัน
  // เพื่อให้ ESLint รู้จัก global variables ของแต่ละสภาพแวดล้อม
  env: {
    browser: true, // สำหรับโค้ดที่รันในเบราว์เซอร์ (เช่น document, window)
    commonjs: true, // สำหรับโค้ดที่ใช้ CommonJS (เช่น require, module.exports)
    es2021: true, // รองรับฟีเจอร์ของ ECMAScript 2021
    jest: true, // สำหรับไฟล์เทสที่ใช้ Jest (เช่น expect, test)
    node: true, // สำหรับโค้ดที่รันบน Node.js (เช่น process, __dirname)
  },

  // ขยาย (extends) ชุดกฎจากที่อื่นมาใช้งาน
  // ลำดับมีความสำคัญ โดยคอนฟิกที่มาทีหลังจะ override คอนฟิกที่มาก่อน
  extends: [
    'next/core-web-vitals', // ชุดกฎสำหรับ Next.js และ Core Web Vitals (สำคัญสำหรับ Next.js)
    'airbnb-base', // ชุดกฎพื้นฐานของ Airbnb (ไม่รวมกฎสำหรับ React)
    'plugin:prettier/recommended', // ใช้กฎของ Prettier และปิดกฎของ ESLint ที่ขัดแย้งกัน **ต้องอยู่สุดท้ายเสมอ**
  ],
  'no-underscore-dangle': ['error', { allow: ['_id'] }],
  // เพิ่มปลั๊กอินเพื่อเสริมความสามารถให้ ESLint
  plugins: ['simple-import-sort', 'prettier'],

  // กำหนด global variables เพิ่มเติมที่ ESLint ควรจะรู้จัก
  globals: {
    React: true, // ทำให้ไม่ต้อง import React ในทุกไฟล์ (จำเป็นสำหรับ React < 17)
  },

  // การตั้งค่าสำหรับไฟล์บางประเภทโดยเฉพาะ
  overrides: [
    {
      // สำหรับไฟล์ TypeScript Declaration (.d.ts)
      files: ['*.d.ts'],
      rules: {
        // ปิดกฎ no-unused-vars เพราะใน .d.ts เป็นเรื่องปกติที่จะประกาศ type โดยไม่ได้ใช้
        'no-unused-vars': 'off',
      },
    },
    {
      // สำหรับไฟล์ layout ของ Next.js
      files: [
        '**/layout.tsx',
        '**/*.layout.tsx',
        '**/*.route.ts',
        '**/*.route.tsx',
      ],
      rules: {
        // อนุญาตให้ใช้ชื่อตัวแปรที่ไม่ใช่ camelCase ได้ (เช่น Metadata) แต่จะขึ้นเป็นคำเตือน (warning)
        camelcase: 'off',
      },
    },
  ],

  // การตั้งค่าสำหรับ Parser ที่จะใช้แปลงโค้ดให้ ESLint เข้าใจ
  parserOptions: {
    project: './tsconfig.json', // ระบุตำแหน่งของ tsconfig.json เพื่อให้กฎที่ต้องใช้ type information ทำงานได้
    ecmaVersion: 'latest', // ใช้ ECMAScript เวอร์ชันล่าสุด
  },

  // กฎ (rules) ที่จะใช้ตรวจสอบโค้ด สามารถ override หรือเพิ่มเติมจาก `extends` ได้
  rules: {
    // === การตั้งค่าส่วนตัว / ปิดกฎที่ไม่ต้องการ ===
    'prefer-const': 'off', // ปิดการบังคับให้ใช้ const แทน let
    'no-unused-expressions': 'off', // ปิดการห้ามใช้ expression ที่ไม่มีผลลัพธ์
    'no-template-curly-in-string': 'off', // ปิดการแจ้งเตือนเมื่อใช้ ${} ใน string ธรรมดา
    'no-plusplus': 'off', // อนุญาตให้ใช้ ++ และ -- ได้
    'max-len': 'off', // ปิดการจำกัดความยาวของบรรทัด
    'object-curly-newline': 'off', // ปิดการบังคับให้ขึ้นบรรทัดใหม่ใน object
    'no-restricted-exports': 'off', // ปิดการห้าม export ชื่อบางชื่อ (เช่น default)
    'no-fallthrough': 'off', // อนุญาตให้ case ใน switch-case ตกไปทำ case ถัดไปได้

    // === การปรับแก้กฎที่สำคัญ ===
    'no-unused-vars': [
      'error', // ตั้งค่าเป็น error
      {
        vars: 'all', // ตรวจสอบตัวแปรทุกตัว
        args: 'none', // **ไม่**ตรวจสอบ arguments ของฟังก์ชัน (มีประโยชน์กับ function ที่ต้องรับ props แต่ไม่ได้ใช้ทั้งหมด)
      },
    ],
    'no-console': 'warn', // แสดงคำเตือน (warning) เมื่อมีการใช้ console.log แต่ไม่ทำให้ build fail

    // === กฎสำหรับ Import (จัดการโดย TypeScript และ simple-import-sort) ===
    'import/no-unresolved': 'off', // ปิด เพราะ TypeScript จัดการเรื่อง resolve path เอง
    'import/extensions': 'off', // ปิด เพราะไม่จำเป็นต้องใส่ .ts, .tsx ต่อท้าย
    'import/prefer-default-export': 'off', // ปิดการบังคับให้ใช้ export default (เพื่อให้ใช้ named export ได้อย่างอิสระ)
    'import/no-extraneous-dependencies': 'off', // ปิดการตรวจสอบ dependency ที่ไม่ได้อยู่ใน package.json (มีประโยชน์ใน monorepo)

    // === กฎสำหรับ simple-import-sort (จัดเรียง import อัตโนมัติ) ===
    'simple-import-sort/exports': 'error', // จัดเรียง exports
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // กลุ่มที่ 1: react และ package ภายนอกทั้งหมด (ขึ้นต้นด้วยตัวอักษร)
          // เช่น import React from 'react'; import { ... } from 'next/router';
          ['^react', '^@?\\w'],

          // กลุ่มที่ 2: internal components หรือ path ที่สร้างขึ้นเอง และ relative imports
          // เช่น import Button from 'components/Button'; import utils from 'src/utils'; import data from './data';
          ['^(components|src)(/.*|$)', '^\\.'],

          // กลุ่มที่ 3: Side effect imports (เช่น import 'styles/globals.css')
          ['^\\u0000'],
        ],
      },
    ],
    // หมายเหตุ: กฎของ tailwindcss ถูกเอาออกตามที่คุณระบุไว้สำหรับ Tailwind CSS v4
  },
};
