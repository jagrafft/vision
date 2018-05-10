import Dependencies._

// PROJECTS
lazy val gateway = (project in file("."))
    .settings(
        name := "vision",
        organization := "co.grafft",
        version := "0.1.0-SNAPSHOT",
        scalaVersion := "2.12.6",
        settings,
        libraryDependencies ++= commonDependencies ++ http
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

scalacOptions ++= Seq("-Ypartial-unification")