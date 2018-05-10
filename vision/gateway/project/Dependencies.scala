import sbt._

object Dependencies {
  val circeVersion = "0.9.3"
  val cirisVersion = "0.9.2"
  val doobieVersion = "0.5.2"
  val http4sVersion = "0.18.11"
  val scalaTestVersion = "3.0.5"

  lazy val circeCore = "io.circe" %% "circe-core" % circeVersion
  lazy val circeGeneric = "io.circe" %% "circe-generic" % circeVersion
  lazy val circeParser = "io.circe" %% "circe-parser" % circeVersion
  
  lazy val cirisCore = "is.cir" %% "ciris-core" % cirisVersion

  lazy val doobieCore = "org.tpolecat" %% "doobie-core" % doobieVersion
  lazy val doobieTest = "org.tpolecat" %% "doobie-scalatest" % doobieVersion
  
  lazy val http4sDsl = "org.http4s" %% "http4s-dsl" % http4sVersion
  lazy val http4sServer = "org.http4s" %% "http4s-blaze-server" % http4sVersion
  lazy val http4sClient = "org.http4s" %% "http4s-blaze-client" % http4sVersion

  lazy val scalaTest = "org.scalatest" %% "scalatest" % scalaTestVersion

  lazy val commonDependencies = Seq(
      cirisCore,
      scalaTest % Test
  )

  lazy val http = Seq(
      circeCore,
      circeGeneric,
      circeParser,
      doobieCore,
      doobieTest % Test,
      http4sDsl,
      http4sServer,
      http4sClient
  )
}

// Cats?