"use client";

import React from "react";

export function FloralDecorationsHero() {
  return (
    <>
      {/* Top Right Tulips Cluster */}
      <svg
        className="absolute -top-20 right-0 sm:right-10 w-48 h-48 sm:w-64 sm:h-64 opacity-70 pointer-events-none"
        viewBox="0 0 300 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Tulip 1 - Dusty Pink */}
        <g transform="translate(100, 80)">
          {/* Stem */}
          <path d="M 0 0 Q 5 20 8 40 Q 10 60 12 80" stroke="#9A9AAD" strokeWidth="2" fill="none" />
          {/* Petals */}
          <ellipse cx="0" cy="15" rx="12" ry="25" fill="#D97AB8" opacity="0.9" />
          <ellipse cx="-10" cy="25" rx="10" ry="22" fill="#D97AB8" opacity="0.8" transform="rotate(-25 0 25)" />
          <ellipse cx="10" cy="25" rx="10" ry="22" fill="#D97AB8" opacity="0.8" transform="rotate(25 0 25)" />
          {/* Center highlight */}
          <ellipse cx="0" cy="18" rx="6" ry="12" fill="#FF88C8" opacity="0.6" />
        </g>

        {/* Tulip 2 - Royal Purple */}
        <g transform="translate(50, 120)">
          <path d="M 0 0 Q -6 20 -8 40 Q -10 60 -12 80" stroke="#9A9AAD" strokeWidth="2" fill="none" />
          <ellipse cx="0" cy="15" rx="12" ry="25" fill="#8A5FBF" opacity="0.9" />
          <ellipse cx="-10" cy="25" rx="10" ry="22" fill="#8A5FBF" opacity="0.8" transform="rotate(-25 0 25)" />
          <ellipse cx="10" cy="25" rx="10" ry="22" fill="#8A5FBF" opacity="0.8" transform="rotate(25 0 25)" />
          <ellipse cx="0" cy="18" rx="6" ry="12" fill="#BF5A9F" opacity="0.6" />
        </g>

        {/* Tulip 3 - Baby Rose */}
        <g transform="translate(150, 100)">
          <path d="M 0 0 Q 4 18 6 38 Q 8 58 10 78" stroke="#9A9AAD" strokeWidth="2" fill="none" />
          <ellipse cx="0" cy="15" rx="12" ry="25" fill="#FF88C8" opacity="0.9" />
          <ellipse cx="-10" cy="25" rx="10" ry="22" fill="#FF88C8" opacity="0.8" transform="rotate(-25 0 25)" />
          <ellipse cx="10" cy="25" rx="10" ry="22" fill="#FF88C8" opacity="0.8" transform="rotate(25 0 25)" />
          <ellipse cx="0" cy="18" rx="6" ry="12" fill="#FFB8D6" opacity="0.6" />
        </g>

        {/* Leaf 1 */}
        <path d="M 55 120 Q 45 140 40 160" stroke="#9A9AAD" strokeWidth="1.5" fill="none" opacity="0.5" />
        {/* Leaf 2 */}
        <path d="M 105 100 Q 115 125 125 145" stroke="#9A9AAD" strokeWidth="1.5" fill="none" opacity="0.5" />
      </svg>

      {/* Bottom Left Flowers Cluster */}
      <svg
        className="absolute -bottom-10 -left-10 sm:left-0 w-56 h-56 sm:w-72 sm:h-72 opacity-60 pointer-events-none"
        viewBox="0 0 300 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Flower 1 - Dusty Pink */}
        <g transform="translate(80, 100)">
          {/* Petals */}
          <circle cx="0" cy="-18" r="10" fill="#D97AB8" opacity="0.85" />
          <circle cx="16" cy="-9" r="10" fill="#D97AB8" opacity="0.85" />
          <circle cx="16" cy="9" r="10" fill="#D97AB8" opacity="0.85" />
          <circle cx="0" cy="18" r="10" fill="#D97AB8" opacity="0.85" />
          <circle cx="-16" cy="9" r="10" fill="#D97AB8" opacity="0.85" />
          <circle cx="-16" cy="-9" r="10" fill="#D97AB8" opacity="0.85" />
          {/* Center */}
          <circle cx="0" cy="0" r="8" fill="#FFB8D6" />
          {/* Stem */}
          <path d="M 0 18 Q -2 35 -3 50" stroke="#9A9AAD" strokeWidth="2" fill="none" />
        </g>

        {/* Flower 2 - Royal Purple */}
        <g transform="translate(160, 80)">
          <circle cx="0" cy="-18" r="10" fill="#8A5FBF" opacity="0.85" />
          <circle cx="16" cy="-9" r="10" fill="#8A5FBF" opacity="0.85" />
          <circle cx="16" cy="9" r="10" fill="#8A5FBF" opacity="0.85" />
          <circle cx="0" cy="18" r="10" fill="#8A5FBF" opacity="0.85" />
          <circle cx="-16" cy="9" r="10" fill="#8A5FBF" opacity="0.85" />
          <circle cx="-16" cy="-9" r="10" fill="#8A5FBF" opacity="0.85" />
          <circle cx="0" cy="0" r="8" fill="#C5A8E6" />
          <path d="M 0 18 Q 3 35 4 50" stroke="#9A9AAD" strokeWidth="2" fill="none" />
        </g>

        {/* Flower 3 - Baby Rose */}
        <g transform="translate(120, 160)">
          <circle cx="0" cy="-18" r="10" fill="#FF88C8" opacity="0.85" />
          <circle cx="16" cy="-9" r="10" fill="#FF88C8" opacity="0.85" />
          <circle cx="16" cy="9" r="10" fill="#FF88C8" opacity="0.85" />
          <circle cx="0" cy="18" r="10" fill="#FF88C8" opacity="0.85" />
          <circle cx="-16" cy="9" r="10" fill="#FF88C8" opacity="0.85" />
          <circle cx="-16" cy="-9" r="10" fill="#FF88C8" opacity="0.85" />
          <circle cx="0" cy="0" r="8" fill="#FFCCE4" />
          <path d="M 0 18 Q -4 35 -5 50" stroke="#9A9AAD" strokeWidth="2" fill="none" />
        </g>

        {/* Leaf details */}
        <path d="M 70 130 Q 60 145 55 160" stroke="#9A9AAD" strokeWidth="1" fill="none" opacity="0.4" />
        <path d="M 130 140 Q 140 155 150 170" stroke="#9A9AAD" strokeWidth="1" fill="none" opacity="0.4" />
      </svg>

      {/* Top Left Small Accent Flowers */}
      <svg
        className="absolute top-20 left-5 w-32 h-32 sm:w-40 sm:h-40 opacity-50 pointer-events-none"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Small Flower - Purple */}
        <g transform="translate(80, 60)">
          <circle cx="0" cy="-12" r="7" fill="#8A5FBF" opacity="0.8" />
          <circle cx="11" cy="-6" r="7" fill="#8A5FBF" opacity="0.8" />
          <circle cx="11" cy="6" r="7" fill="#8A5FBF" opacity="0.8" />
          <circle cx="0" cy="12" r="7" fill="#8A5FBF" opacity="0.8" />
          <circle cx="-11" cy="6" r="7" fill="#8A5FBF" opacity="0.8" />
          <circle cx="-11" cy="-6" r="7" fill="#8A5FBF" opacity="0.8" />
          <circle cx="0" cy="0" r="5" fill="#DFD0F2" />
          <path d="M 0 12 L 1 25" stroke="#9A9AAD" strokeWidth="1.5" fill="none" />
        </g>

        {/* Mini Tulip */}
        <g transform="translate(40, 100)">
          <path d="M 0 0 L 1 15" stroke="#9A9AAD" strokeWidth="1" fill="none" />
          <ellipse cx="0" cy="8" rx="6" ry="12" fill="#D97AB8" opacity="0.8" />
          <ellipse cx="-4" cy="12" rx="5" ry="10" fill="#D97AB8" opacity="0.7" />
          <ellipse cx="4" cy="12" rx="5" ry="10" fill="#D97AB8" opacity="0.7" />
        </g>
      </svg>

      {/* Right Bottom Accent */}
      <svg
        className="absolute bottom-20 right-10 w-28 h-28 sm:w-36 sm:h-36 opacity-45 pointer-events-none"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Small Flower - Rose */}
        <g transform="translate(80, 80)">
          <circle cx="0" cy="-14" r="8" fill="#FF88C8" opacity="0.8" />
          <circle cx="12" cy="-7" r="8" fill="#FF88C8" opacity="0.8" />
          <circle cx="12" cy="7" r="8" fill="#FF88C8" opacity="0.8" />
          <circle cx="0" cy="14" r="8" fill="#FF88C8" opacity="0.8" />
          <circle cx="-12" cy="7" r="8" fill="#FF88C8" opacity="0.8" />
          <circle cx="-12" cy="-7" r="8" fill="#FF88C8" opacity="0.8" />
          <circle cx="0" cy="0" r="6" fill="#FFD4E8" />
        </g>
      </svg>
    </>
  );
}

export function FloralDecorationsSide() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-30 pointer-events-none"
      viewBox="0 0 1200 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      {/* Scattered small flowers throughout */}
      <g transform="translate(100, 150)">
        <circle cx="0" cy="-8" r="6" fill="#D97AB8" opacity="0.6" />
        <circle cx="7" cy="-4" r="6" fill="#D97AB8" opacity="0.6" />
        <circle cx="7" cy="4" r="6" fill="#D97AB8" opacity="0.6" />
        <circle cx="0" cy="8" r="6" fill="#D97AB8" opacity="0.6" />
        <circle cx="-7" cy="4" r="6" fill="#D97AB8" opacity="0.6" />
        <circle cx="-7" cy="-4" r="6" fill="#D97AB8" opacity="0.6" />
        <circle cx="0" cy="0" r="4" fill="#FFB8D6" />
      </g>

      <g transform="translate(1050, 200)">
        <circle cx="0" cy="-8" r="6" fill="#8A5FBF" opacity="0.6" />
        <circle cx="7" cy="-4" r="6" fill="#8A5FBF" opacity="0.6" />
        <circle cx="7" cy="4" r="6" fill="#8A5FBF" opacity="0.6" />
        <circle cx="0" cy="8" r="6" fill="#8A5FBF" opacity="0.6" />
        <circle cx="-7" cy="4" r="6" fill="#8A5FBF" opacity="0.6" />
        <circle cx="-7" cy="-4" r="6" fill="#8A5FBF" opacity="0.6" />
        <circle cx="0" cy="0" r="4" fill="#DFD0F2" />
      </g>

      <g transform="translate(200, 450)">
        <circle cx="0" cy="-8" r="6" fill="#FF88C8" opacity="0.6" />
        <circle cx="7" cy="-4" r="6" fill="#FF88C8" opacity="0.6" />
        <circle cx="7" cy="4" r="6" fill="#FF88C8" opacity="0.6" />
        <circle cx="0" cy="8" r="6" fill="#FF88C8" opacity="0.6" />
        <circle cx="-7" cy="4" r="6" fill="#FF88C8" opacity="0.6" />
        <circle cx="-7" cy="-4" r="6" fill="#FF88C8" opacity="0.6" />
        <circle cx="0" cy="0" r="4" fill="#FFCCE4" />
      </g>

      <g transform="translate(950, 400)">
        <circle cx="0" cy="-8" r="6" fill="#D97AB8" opacity="0.5" />
        <circle cx="7" cy="-4" r="6" fill="#D97AB8" opacity="0.5" />
        <circle cx="7" cy="4" r="6" fill="#D97AB8" opacity="0.5" />
        <circle cx="0" cy="8" r="6" fill="#D97AB8" opacity="0.5" />
        <circle cx="-7" cy="4" r="6" fill="#D97AB8" opacity="0.5" />
        <circle cx="-7" cy="-4" r="6" fill="#D97AB8" opacity="0.5" />
        <circle cx="0" cy="0" r="4" fill="#FFB8D6" />
      </g>
    </svg>
  );
}

export function FloralDecorationsFull() {
  return (
    <>
      <FloralDecorationsHero />
      <FloralDecorationsSide />
    </>
  );
}
