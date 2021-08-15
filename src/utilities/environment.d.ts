/**
 * Specifies whether the current build is for production or development environment.
 */
type BuildConfiguration = "production" | "development";


/**
 * The current active build configuration.
 */
declare const __BUILD_CONFIGURATION__: BuildConfiguration;
