{
  description = "slidev environment";
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-25.11";
  };

  outputs = {
    self,
    nixpkgs,
  }: let
    system = "x86_64-linux";
    pkgs = import nixpkgs {
      inherit system;
    };
  in {
    devShells.${system}.default = pkgs.mkShell {
      name = "slidev devshell";
      packages = with pkgs; [
        nodejs_24
        nodePackages.pnpm
      ];
    };
  };
}
