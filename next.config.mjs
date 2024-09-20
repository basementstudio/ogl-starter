import withBundleAnalyzer from "@next/bundle-analyzer"
import withTM from "next-transpile-modules"

/**
 * @type {import('next').NextConfig}
 */
const config = {
  // ... configuración existente ...
}

const createConfig = (_phase, { defaultConfig: _ }) => {
  const plugins = [
    withBundleAnalyzer({ enabled: process.env.ANALYZE === "true" }),
    withTM([]) // añade los módulos que quieres transpilar aquí
  ]
  return plugins.reduce((acc, plugin) => plugin(acc), { ...config })
}

export default createConfig
