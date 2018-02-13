import sbt._

object Dependencies {
  lazy val akkaActors = "com.typesafe.akka" %% "akka-actor" % "2.5.9"
  lazy val lightbendConfig = "com.typesafe" % "config" % "1.3.1"
  lazy val akkaTestKit = "com.typesafe.akka" %% "akka-testkit" % "2.5.9"
  lazy val scalaTest = "org.scalatest" %% "scalatest" % "3.0.4"
}
