import Dependencies._

name := "vision"
organization in ThisBuild := "co.grafft"
version in ThisBuild := "0.1.0-SNAPSHOT"
scalaVersion in ThisBuild := "2.12.5"

// PROJECTS
lazy val global = project
    .in(file("."))
    .settings(settings)
    .aggregate(
        core,
        av
    )

lazy val core = project
    .settings(
        name := "core",
        settings,
        libraryDependencies ++= commonDependencies
    )

lazy val av = project
    .settings(
        name := "av",
        settings,
        assemblySettings,
        libraryDependencies ++= commonDependencies ++ resourcePoolDependencies
    )
    .dependsOn(
        core
    )

// DEPENDENCIES
lazy val commonDependencies = Seq(
    scalaTest % Test
)

lazy val resourcePoolDependencies = Seq(
    cirisCore
)

// SETTINGS
lazy val settings = Seq(
  scalacOptions ++=  Seq(
      "-unchecked",
      "-feature",
      "-language:existentials",
      "-language:higherKinds",
      "-language:implicitConversions",
      "-language:postfixOps",
      "-deprecation",
      "-encoding",
      "utf8"
    ),
  resolvers ++= Seq(
    "Local Maven Repository" at "file://" + Path.userHome.absolutePath + "/.m2/repository",
    Resolver.sonatypeRepo("releases"),
    Resolver.sonatypeRepo("snapshots")
  )
)

lazy val assemblySettings = Seq(
    assemblyJarName in assembly := "vision-" + name.value + ".jar",
    assemblyMergeStrategy in assembly := {
        case PathList("META-INF", xs @ _*) => MergeStrategy.discard
        case _                             => MergeStrategy.first
    }
)